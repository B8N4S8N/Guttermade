export interface User {
  /**
   * The user's email address
   */
  email?: string | null;

  /**
   * The user's unique id number
   */
  id: string;

  /**
   * The users preferred avatar.
   * Usually provided by the user's OAuth provider of choice
   */
  image?: string | null;

  /**
   * The user's full name
   */
  name?: string | null;

  /**
   * The user's address
   */
  address?: string | null;

  /**
   * Wether the user is logged in or not
   */
  isLoggedIn: boolean;
}
