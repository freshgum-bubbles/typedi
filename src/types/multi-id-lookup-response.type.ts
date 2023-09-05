import { ManyServicesMetadata } from "../interfaces/many-services-metadata.interface";
import { ServiceIdentifierLocation } from "./service-identifier-location.type";

export type MultiIDLookupResponse =
    | [location: ServiceIdentifierLocation.None, idMap: null]
    | [location: ServiceIdentifierLocation.Local, idMap: ManyServicesMetadata]
    | [location: ServiceIdentifierLocation.Parent, idMap: ManyServicesMetadata];
