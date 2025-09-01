// constants/sidebar.ts
import { FaBars, FaSchool, FaUserGraduate, FaUsers } from "react-icons/fa";
import { FaUserSecret } from "react-icons/fa";
import { PiUsersThree } from "react-icons/pi";
import { RiHome6Line } from "react-icons/ri";
import { PiBooksLight } from "react-icons/pi";
import { TbLayoutDashboard } from "react-icons/tb";
import { MdOutlineInsertChart } from "react-icons/md";
import { TbSettings2 } from "react-icons/tb";
import { TbLogout } from "react-icons/tb";

export function ResponsiveNavData() {
  const desktopItems = [
    { label: "Dashboard", icon: TbLayoutDashboard, path: "/dashboard/home" },
    { label: "Classrooms", icon: FaSchool, path: "/dashboard/classrooms" },
    { label: "Students", icon: FaUserGraduate, path: "/dashboard/students" },
    { label: "Subjects", icon: PiBooksLight, path: "/dashboard/subjects" },
    { label: "Staffs", icon: PiUsersThree, path: "/dashboard/staffs" },
    {
      label: "Role/Permissions",
      icon: FaUserSecret,
      path: "/dashboard/roles",
    },
    {
      label: "Results",
      icon: MdOutlineInsertChart,
      path: "/dashboard/results",
    },
    { label: "Users", icon: FaUsers, path: "/dashboard/users" },
  ];

  const bottomItems = [
    { label: "Settings", icon: TbSettings2, path: "/dashboard/settings" },
    { label: "Logout", icon: TbLogout, path: "/auth/signin" },
  ];

  const mobileItems = [
    { label: "Home", icon: RiHome6Line, path: "/dashboard/home" },
    { label: "Students", icon: FaUserGraduate, path: "/dashboard/students" },
    { label: "Classrooms", icon: FaSchool, path: "/dashboard/classrooms" },
    {
      label: "Results",
      icon: MdOutlineInsertChart,
      path: "/dashboard/results",
    },
    { label: "More", icon: FaBars, path: "/dashboard/more/" },
  ];

  return { desktopItems, bottomItems, mobileItems };
}
