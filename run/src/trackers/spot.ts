import request from 'request-zero';

export async function refresh(datastore: any, hour: number, timeout: number): Promise<number> {
  const start = Date.now();

  const query = datastore
    .createQuery('Tracker')
    .filter('device', '=', 'spot')
    .filter('updated', '<', start - 3 * 60 * 1000)
    .order('updated', { descending: true });

  const devices = (await datastore.runQuery(query))[0];
  const startDate = new Date(start - hour * 3600 * 1000).toISOString().substring(0, 19) + '-0000';

  let numDevices = 0;
  let numActiveDevices = 0;
  for (; numDevices < devices.length; numDevices++) {
    const features: any[] = [];
    const device = devices[numDevices];
    const id: string = device.spot;
    if (/^\w+$/i.test(id)) {
      const url = `https://api.findmespot.com/spot-main-web/consumer/rest-api/2.0/public/feed/${id}/message.json?startDate=${startDate}`;
      const response = await request(url);
      if (response.code == 200) {
        console.log(`Refreshing spot @ ${id}`);
        const messages = JSON.parse(response.body)?.response?.feedMessageResponse?.messages?.message;
        if (messages && Array.isArray(messages)) {
          numActiveDevices++;
          messages.forEach((m: any) => {
            features.push({
              lon: m.longitude,
              lat: m.latitude,
              ts: m.unixTime * 1000,
              alt: m.altitude,
              name: m.messengerName,
              emergency: m.messageType == 'HELP',
              msg: m.messageContent,
            });
          });
        }
      } else {
        console.log(`Error refreshing spot @ ${id}`);
      }
      if (features.length) {
        const line = features.map((f) => [f.lon, f.lat]);
        features.push({ line, first_ts: features[0].ts });
      }
    }

    device.features = JSON.stringify(features);
    device.updated = Date.now();
    device.active = features.length > 0;

    datastore.save({
      key: device[datastore.KEY],
      data: device,
      excludeFromIndexes: ['features'],
    });

    if (Date.now() - start > timeout * 1000) {
      console.error(`Timeout for spot devices (${timeout}s)`);
      break;
    }
  }
  console.log(`Refreshed ${numDevices} spot in ${(Date.now() - start) / 1000}s`);
  return numActiveDevices;
}
