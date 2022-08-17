export type NotificationModel = {
    notificationId: string,
    isRead: boolean,
    message: string,
    type? : string,
    projectId?: string,
    projectName?: string,
    updatedProjectStatus? : string
  }