export interface ChoreRequestNotification {
  requestId: number;
  senderName: string;
  choreId: number;
  message: string;
  status: string;
  createdAt: string;
}

export interface ChoreRequestCreateRequest {
  receiverId: number;
  choreId: number;
  choreName: string;
}
