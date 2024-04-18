export default interface IMessage {
	senderId: string;
	senderName: string;
	text: string;
	sentAt: Date;
	latex?: boolean;
}