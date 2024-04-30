import { useSession } from 'next-auth/react';

export const useCurrentUser = () => {
  const session = useSession();

  return session.data?.user;
};

// import { useEffect, useState } from 'react';
// import { useSession } from 'next-auth/react';

// export const useCurrentUser = () => {
//   const { data: session } = useSession();
//   const [currentUser, setCurrentUser] = useState(session?.user);

//   useEffect(() => {
//     setCurrentUser(session?.user);
//   }, [session]);

//   return currentUser;
// };
