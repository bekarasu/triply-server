export class UserVO {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  phoneNumber: string;
  status: string;

  constructor(props: any) {
    this.id = props.id;
    this.name = props.name;
    this.surname = props.surname;
    this.email = props.email;
    this.phone = props.phone;
    this.phoneNumber = props.phoneNumber || props.phone;
    this.status = props.status;
  }
}
