import type { Fav, LatLon } from '@windy/interfaces';
import { useState } from 'preact/hooks';

import { SUPPORTED_MODEL_PREFIXES } from '../redux/plugin-slice';
import { getFavLabel } from '../util/utils';

const windyUtils = W.utils;
const windyModels = W.models;

export type FavoriteProps = {
  favorites: Fav[];
  location: LatLon;
  isMobile: boolean;
  onSelected: (location: LatLon) => void;
  modelName: string;
};

export function Favorites({ favorites, location, isMobile, onSelected, modelName }: FavoriteProps) {
  const locationStr = windyUtils.latLon2str(location);
  const [isModelExpanded, setIsModelExpanded] = useState(false);
  const [isLocationExpanded, setIsLocationExpanded] = useState(false);

  function toggleModelSelect() {
    const expanded = !isModelExpanded;
    if (expanded) {
      setIsLocationExpanded(false);
    }
    setIsModelExpanded(expanded);
  }

  function toggleLocationSelect() {
    const expanded = !isLocationExpanded;
    if (expanded) {
      setIsModelExpanded(false);
    }
    setIsLocationExpanded(expanded);
  }

  if (isMobile) {
    const models: string[] = windyModels
      .getAllPointProducts(location)
      .filter((model: string) => SUPPORTED_MODEL_PREFIXES.some((prefix) => model.startsWith(prefix)))
      .sort();

    let currentFavorite = '';
    for (const favorite of favorites) {
      const favLocationStr = windyUtils.latLon2str(favorite);
      if (favLocationStr === locationStr) {
        currentFavorite = getFavLabel(favorite);
        break;
      }
    }

    return (
      <>
        <section id="wsp-favorite">
          <div
            className={`select ${isModelExpanded ? 'active' : ''}`}
            data-icon="w"
            data-icon-after="g"
            onClick={toggleModelSelect}
          >
            <small class="size-m">{modelName}</small>
          </div>
          <div
            className={`select ${isLocationExpanded ? 'active' : ''}`}
            data-icon="D"
            data-icon-after="g"
            onClick={toggleLocationSelect}
          >
            <small class="size-m">{currentFavorite}</small>
          </div>
          <a style="margin: 0 10px 3px 5px" href="https://buymeacoffee.com/vic.b" target="_blank">
            ☕️
          </a>
        </section>

        {isModelExpanded && (
          <div class="options">
            {models.map((model: string) => (
              <span className={model == modelName ? 'selected' : ''} onClick={() => W.store.set('product', model)}>
                {model}
              </span>
            ))}
          </div>
        )}

        {isLocationExpanded && (
          <div class="options">
            {favorites.map((favorite: Fav) => (
              <span
                className={windyUtils.latLon2str(favorite) == locationStr ? 'selected' : ''}
                onClick={() => onSelected({ lat: favorite.lat, lon: favorite.lon })}
              >
                {getFavLabel(favorite)}
              </span>
            ))}
          </div>
        )}
      </>
    );
  }

  if (favorites.length == 0) {
    return (
      <div id="wsp-flyto" className="size-m">
        <span data-icon="m" class="fg-icons"></span> Add favorites to windy to quickly check different locations.
      </div>
    );
  }

  return (
    <div id="wsp-flyto" className="size-m">
      {favorites.map((favorite: Fav) => {
        return (
          <>
            <div
              className={`button button--transparent ${
                windyUtils.latLon2str(favorite) == locationStr ? 'selected' : ''
              }`}
              onClick={() => onSelected({ lat: favorite.lat, lon: favorite.lon })}
            >
              {getFavLabel(favorite)}
            </div>
          </>
        );
      })}
    </div>
  );
}