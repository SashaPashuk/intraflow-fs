import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'intraflow-api',
  brokers: ['localhost:9092'],
});

export const producer = kafka.producer();

export const sendFileUploadedEvent = async (file: { id: string; name: string; url: string }) => {
  await producer.connect();
  await producer.send({
    topic: 'file_uploaded',
    messages: [
      {
        key: file.id,
        value: JSON.stringify(file),
      },
    ],
  });
  console.log('[Kafka] Sent file_uploaded event:', file.name);
  await producer.disconnect();
};
