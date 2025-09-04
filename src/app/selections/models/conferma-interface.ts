import { EsameAmbulatorioInterface } from './esame-ambulatorio-interface';

export interface ConfermaInterface {
  id: number;
  createdAt: Date;
  esameAmbulatorio: EsameAmbulatorioInterface;
}
