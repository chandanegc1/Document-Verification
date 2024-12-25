import React from 'react';
import { MdQueryStats } from 'react-icons/md';
import { FaWpforms } from 'react-icons/fa';
import { ImProfile } from 'react-icons/im';
import { MdAdminPanelSettings } from 'react-icons/md';
const isAdmin = localStorage.getItem("role") === "admin";
const links = [
  {
    text: 'add doc',
    path: '.',
    icon: <FaWpforms />,
  },
  {
    text: 'all docs',
    path: 'all-docs',
    icon: <MdQueryStats />,
  },
  {
    text: 'CD Registration',
    path: 'cd-register',
    icon:  <ImProfile />,
  },
  // {
  //   text: 'stats',
  //   path: 'stats',
  //   icon: <IoBarChartSharp />,
  // },
  {
    text: 'profile',
    path: 'profile',
    icon: <ImProfile />,
  },
  {
    text: 'admin',
    path: 'admin',
    icon: <MdAdminPanelSettings />,
  },
];

export default links;
