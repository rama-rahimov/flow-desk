export class UserDTO {
    user:{
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        role_id: number;
        company:{
            link:string,
            employments_count:number,
            id:number,
        };
        avatar:{
            id:number,
            url:string,
            public_id:string
        }
    }
}