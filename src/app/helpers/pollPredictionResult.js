import { delay, ServiceBusClient, ServiceBusMessage } from "@azure/service-bus";
import config from "../config";

// connection string to your Service Bus namespace
const connectionString = config.AZURE_CONNECTION_STR

// name of the queue
const queueName = "predict-python-to-react"

 export async function getPredictionResult(messageId) {
  console.log("polling for messageId: " + messageId)
	// create a Service Bus client using the connection string to the Service Bus namespace
	const sbClient = new ServiceBusClient(connectionString);

	// createReceiver() can also be used to create a receiver for a subscription.
	const receiver = sbClient.createReceiver(queueName);


  for await (let messageReceived of receiver.getMessageIterator()) {
    console.log(`Received message: ${messageReceived.body}`);
    



    const messageIdFromQueue = messageReceived.body.messageId;
    console.log("type of messageReceived: ",  typeof messageReceived.body);
    console.log("messageIdFromQueue: ", messageIdFromQueue);

    // dequeue message if it is the message we are looking for
    if (messageIdFromQueue === messageId) {
        console.log(`Dequeued message: ${messageReceived.body}`);
        receiver.completeMessage(messageReceived);
        const predictionResult = messageReceived.body;
        console.log("predictionResult: ", predictionResult);
        await receiver.close();	
        await sbClient.close();
        return predictionResult;
    }
  }

}    



