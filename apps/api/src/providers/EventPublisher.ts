import { sendFileUploadedEvent } from "@intraflow/utils/kafka";

export class EventPublisher {
  static async fileUploaded(payload: {
    id: string;
    name: string;
    url: string;
  }) {
    await sendFileUploadedEvent(payload);
  }
}
