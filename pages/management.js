import { getSession } from "next-auth/client";
import UserManagement from "../components/user-management/user-management";

function Management() {
  return <UserManagement />;
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
}
export default Management;
