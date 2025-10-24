import { gql } from "@apollo/client";

export const SIGN_UP = gql`
	mutation SignUp($input: SignUpInput!) {
		signUp(input: $input) {
			user {
				_id
				name
				username
			}
			token
		}
	}
`;

export const LOGIN = gql`
	mutation Login($input: LoginInput!) {
		login(input: $input) {
			user {
				_id
				name
				username
			}
			token
		}
	}
`;

export const LOGOUT = gql`
	mutation Logout {
		logout {
			message
		}
	}
`;
