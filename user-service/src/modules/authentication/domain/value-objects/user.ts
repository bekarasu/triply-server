export class UserVO {
  id: string;
  email: string;
  phoneNumber: string;

  constructor(props: any) {
    this.id = props.id;
    this.email = props.email;
    this.phoneNumber = props.phoneNumber;
  }
}
