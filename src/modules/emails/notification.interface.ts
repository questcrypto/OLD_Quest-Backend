export enum NotificationType {
    addNewProperty=1,
    updateProperty=2,
    ApprovedByOwner=3,
    ApproveByHOAAdmin=4,
    AddComment=5,
    sucessfulBid=6,
    unsucessfulBid=7,
    upgradeBid=8
    
}

export interface Notification {
    id: string
    receiver: string
    message: string
    type: NotificationType   
  }