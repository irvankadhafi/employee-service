import { AuthServiceClient } from '@/proto/auth_service_grpc_pb';
import { injectable } from 'tsyringe';
import * as grpc from '@grpc/grpc-js';

@injectable()
export class AuthServiceClientWrapper extends AuthServiceClient {
    constructor() {
        super('localhost:50051', grpc.credentials.createInsecure());
    }
}