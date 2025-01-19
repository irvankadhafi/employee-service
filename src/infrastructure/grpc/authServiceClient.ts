// src/infrastructure/grpc/authServiceClient.ts
import { AuthServiceClient } from '@/proto/auth_service_grpc_pb';
import { injectable } from 'tsyringe';
import * as grpc from '@grpc/grpc-js';
import {FindByIdRequest} from "@/proto/auth_service_pb";

@injectable()
export class AuthServiceClientWrapper extends AuthServiceClient {
    constructor() {
        super('localhost:50051', grpc.credentials.createInsecure());
    }

    // Utility method to create metadata
    private createMetadata(): grpc.Metadata {
        const metadata = new grpc.Metadata();
        metadata.add('x-internal-service', 'true'); // Add your custom metadata
        return metadata;
    }

    // Override the findUserById method to include metadata
    findById(
        argument: FindByIdRequest,
        callback: grpc.requestCallback<any>
    ): grpc.ClientUnaryCall {
        const metadata = this.createMetadata();
        return super.findUserById(argument, metadata, callback);
    }
}