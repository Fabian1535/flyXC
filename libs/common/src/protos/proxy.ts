// @generated by protobuf-ts 2.9.4 with parameter long_type_number,force_optimize_code_size
// @generated from protobuf file "proxy.proto" (syntax proto3)
// tslint:disable
import { MessageType } from '@protobuf-ts/runtime';
/**
 * @generated from protobuf message Request
 */
export interface Request {
  /**
   * @generated from protobuf field: string url = 1;
   */
  url: string;
  /**
   * @generated from protobuf field: uint32 retry = 2;
   */
  retry: number;
  /**
   * @generated from protobuf field: uint32 timeout_s = 3;
   */
  timeoutS: number;
  /**
   * @generated from protobuf field: bool retry_on_timeout = 4;
   */
  retryOnTimeout: boolean;
  /**
   * @generated from protobuf field: string key = 5;
   */
  key: string;
}
// @generated message type with reflection information, may provide speed optimized methods
class Request$Type extends MessageType<Request> {
  constructor() {
    super('Request', [
      { no: 1, name: 'url', kind: 'scalar', T: 9 /*ScalarType.STRING*/ },
      { no: 2, name: 'retry', kind: 'scalar', T: 13 /*ScalarType.UINT32*/ },
      { no: 3, name: 'timeout_s', kind: 'scalar', T: 13 /*ScalarType.UINT32*/ },
      { no: 4, name: 'retry_on_timeout', kind: 'scalar', T: 8 /*ScalarType.BOOL*/ },
      { no: 5, name: 'key', kind: 'scalar', T: 9 /*ScalarType.STRING*/ },
    ]);
  }
}
/**
 * @generated MessageType for protobuf message Request
 */
export const Request = new Request$Type();
