import React from 'react';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SchoolIcon from '@mui/icons-material/School';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import RateReviewIcon from '@mui/icons-material/RateReview';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import AssessmentIcon from '@mui/icons-material/Assessment';

const SidebarData = [
    {
        title: "Account",
        icon: <AccountBoxIcon />,
        link: "/account"
    },
    {
        title: "Students",
        icon: <SchoolIcon />,
        link: "/student"
    },
    {
        title: "Notification",
        icon: <NotificationsActiveIcon />,
        link: "/notification"
    },
    {
        title: "Feedback",
        icon: <RateReviewIcon />,
        link: "/feedback"
    },
    {
        title: "Case",
        icon: <PostAddIcon />,
        link: "/case"
    },
    {
        title: "Pendings",
        icon: <PendingActionsIcon />,
        link: "/pendings"
    },
    {
        title: "Sanctions",
        icon: <LocalPoliceIcon />,
        link: "/sanctions"
    },
    {
        title: "Report",
        icon: <AssessmentIcon />,
        link: "/report"
    }
];
export default SidebarData;