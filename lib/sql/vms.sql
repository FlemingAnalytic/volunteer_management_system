-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Apr 08, 2015 at 09:03 PM
-- Server version: 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `vms`
--
CREATE DATABASE IF NOT EXISTS `vms` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `vms`;

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `getids`()
    MODIFIES SQL DATA
select last_insert_id()$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `test`(IN `@shortdesc` VARCHAR(30))
    MODIFIES SQL DATA
    DETERMINISTIC
insert into events(event_short_shortname) values (@shortdesc)$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `areas`
--

CREATE TABLE IF NOT EXISTS `areas` (
  `area_id` int(11) NOT NULL AUTO_INCREMENT,
  `city_id` int(11) NOT NULL,
  `area_name` varchar(20) NOT NULL,
  `seq` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`area_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=9 ;

-- --------------------------------------------------------

--
-- Table structure for table `cities`
--

CREATE TABLE IF NOT EXISTS `cities` (
  `city_id` int(11) NOT NULL AUTO_INCREMENT,
  `city_name` varchar(30) NOT NULL,
  `city_state` varchar(20) NOT NULL,
  `city_misc` varchar(4) NOT NULL,
  PRIMARY KEY (`city_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE IF NOT EXISTS `events` (
  `event_id` int(11) NOT NULL AUTO_INCREMENT,
  `event_name` varchar(50) NOT NULL,
  `event_short_name` varchar(20) NOT NULL,
  `event_date` date NOT NULL,
  `event_start_time` varchar(10) NOT NULL,
  `event_end_time` varchar(10) NOT NULL,
  `event_location` varchar(30) NOT NULL,
  `event_city` varchar(30) NOT NULL,
  `event_state` varchar(10) NOT NULL,
  `event_zip` varchar(12) NOT NULL,
  `event_contact` varchar(30) NOT NULL,
  `event_phone` varchar(30) NOT NULL,
  `event_owner` int(11) NOT NULL,
  `event_email` varchar(40) NOT NULL,
  `event_status` int(11) NOT NULL,
  PRIMARY KEY (`event_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=14 ;

-- --------------------------------------------------------

--
-- Table structure for table `event_roles`
--

CREATE TABLE IF NOT EXISTS `event_roles` (
  `event_role_id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NOT NULL,
  `event_role_title` varchar(50) NOT NULL,
  `event_role_description` varchar(100) NOT NULL,
  `event_role_qualifications` varchar(100) NOT NULL,
  `event_role_pre_mins` int(11) NOT NULL,
  `event_role_post_mins` int(11) NOT NULL,
  `event_role_qty` int(11) NOT NULL,
  `event_role_status` int(11) NOT NULL,
  PRIMARY KEY (`event_role_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=11 ;

-- --------------------------------------------------------

--
-- Table structure for table `event_role_volunteers`
--

CREATE TABLE IF NOT EXISTS `event_role_volunteers` (
  `event_role_volunteer_id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NOT NULL,
  `event_role_id` int(11) NOT NULL,
  `event_role_seq` int(11) NOT NULL,
  `volunteer_id` int(11) NOT NULL,
  `event_role_volunteer_status` int(11) NOT NULL,
  PRIMARY KEY (`event_role_volunteer_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=32 ;

-- --------------------------------------------------------

--
-- Table structure for table `newevents`
--

CREATE TABLE IF NOT EXISTS `newevents` (
  `newevent_id` int(11) NOT NULL AUTO_INCREMENT,
  `short_title` varchar(20) NOT NULL DEFAULT ' Create Event',
  `color` varchar(20) NOT NULL DEFAULT 'green',
  `url` int(11) NOT NULL DEFAULT '-1',
  PRIMARY KEY (`newevent_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(40) NOT NULL,
  `user_email` varchar(30) NOT NULL,
  `user_role` varchar(20) NOT NULL DEFAULT 'Volunteer',
  `user_status` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

-- --------------------------------------------------------

--
-- Stand-in structure for view `vw_events`
--
CREATE TABLE IF NOT EXISTS `vw_events` (
`event_id` int(11)
,`event_name` varchar(50)
,`event_short_name` varchar(20)
,`event_date` date
,`event_start_time` varchar(10)
,`event_end_time` varchar(10)
,`event_location` varchar(30)
,`event_city` varchar(30)
,`event_state` varchar(10)
,`event_zip` varchar(12)
,`event_contact` varchar(30)
,`event_phone` varchar(30)
,`event_owner` int(11)
,`event_email` varchar(40)
,`event_status` int(11)
,`need` decimal(54,0)
,`have` decimal(54,0)
);
-- --------------------------------------------------------

--
-- Stand-in structure for view `vw_event_roles`
--
CREATE TABLE IF NOT EXISTS `vw_event_roles` (
`event_role_id` int(11)
,`event_id` int(11)
,`event_role_title` varchar(50)
,`event_role_description` varchar(100)
,`event_role_qualifications` varchar(100)
,`event_role_pre_mins` int(11)
,`event_role_post_mins` int(11)
,`event_role_qty` int(11)
,`event_role_status` int(11)
,`vols` bigint(21)
);
-- --------------------------------------------------------

--
-- Stand-in structure for view `vw_event_vols`
--
CREATE TABLE IF NOT EXISTS `vw_event_vols` (
`event_role_id` int(11)
,`event_id` int(11)
,`event_role_title` varchar(50)
,`event_role_description` varchar(100)
,`event_role_qualifications` varchar(100)
,`event_role_pre_mins` int(11)
,`event_role_post_mins` int(11)
,`event_role_qty` int(11)
,`event_role_status` int(11)
,`vols` bigint(21)
);
-- --------------------------------------------------------

--
-- Stand-in structure for view `vw_needs`
--
CREATE TABLE IF NOT EXISTS `vw_needs` (
`source` varchar(4)
,`event_id` int(11)
,`qty` decimal(32,0)
);
-- --------------------------------------------------------

--
-- Stand-in structure for view `vw_need_summary`
--
CREATE TABLE IF NOT EXISTS `vw_need_summary` (
`event_id` int(11)
,`need` decimal(54,0)
,`have` decimal(54,0)
);
-- --------------------------------------------------------

--
-- Stand-in structure for view `vw_volunteer_roles`
--
CREATE TABLE IF NOT EXISTS `vw_volunteer_roles` (
`event_id` int(11)
,`event_role_id` int(11)
,`volunteer_id` int(11)
);
-- --------------------------------------------------------

--
-- Stand-in structure for view `vw_vol_events`
--
CREATE TABLE IF NOT EXISTS `vw_vol_events` (
`event_id` int(11)
,`volunteer_id` int(11)
);
-- --------------------------------------------------------

--
-- Structure for view `vw_events`
--
DROP TABLE IF EXISTS `vw_events`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_events` AS select `events`.`event_id` AS `event_id`,`events`.`event_name` AS `event_name`,`events`.`event_short_name` AS `event_short_name`,`events`.`event_date` AS `event_date`,`events`.`event_start_time` AS `event_start_time`,`events`.`event_end_time` AS `event_end_time`,`events`.`event_location` AS `event_location`,`events`.`event_city` AS `event_city`,`events`.`event_state` AS `event_state`,`events`.`event_zip` AS `event_zip`,`events`.`event_contact` AS `event_contact`,`events`.`event_phone` AS `event_phone`,`events`.`event_owner` AS `event_owner`,`events`.`event_email` AS `event_email`,`events`.`event_status` AS `event_status`,ifnull(`vw_need_summary`.`need`,0) AS `need`,ifnull(`vw_need_summary`.`have`,0) AS `have` from (`events` left join `vw_need_summary` on((`events`.`event_id` = `vw_need_summary`.`event_id`)));

-- --------------------------------------------------------

--
-- Structure for view `vw_event_roles`
--
DROP TABLE IF EXISTS `vw_event_roles`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_event_roles` AS select `event_roles`.`event_role_id` AS `event_role_id`,`event_roles`.`event_id` AS `event_id`,`event_roles`.`event_role_title` AS `event_role_title`,`event_roles`.`event_role_description` AS `event_role_description`,`event_roles`.`event_role_qualifications` AS `event_role_qualifications`,`event_roles`.`event_role_pre_mins` AS `event_role_pre_mins`,`event_roles`.`event_role_post_mins` AS `event_role_post_mins`,`event_roles`.`event_role_qty` AS `event_role_qty`,`event_roles`.`event_role_status` AS `event_role_status`,count(`event_role_volunteers`.`volunteer_id`) AS `vols` from (`event_roles` left join `event_role_volunteers` on((`event_roles`.`event_role_id` = `event_role_volunteers`.`event_role_id`))) group by `event_roles`.`event_role_id`,`event_roles`.`event_id`,`event_roles`.`event_role_title`,`event_roles`.`event_role_description`,`event_roles`.`event_role_qualifications`,`event_roles`.`event_role_pre_mins`,`event_roles`.`event_role_post_mins`,`event_roles`.`event_role_qty`,`event_roles`.`event_role_status`;

-- --------------------------------------------------------

--
-- Structure for view `vw_event_vols`
--
DROP TABLE IF EXISTS `vw_event_vols`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_event_vols` AS select `event_roles`.`event_role_id` AS `event_role_id`,`event_roles`.`event_id` AS `event_id`,`event_roles`.`event_role_title` AS `event_role_title`,`event_roles`.`event_role_description` AS `event_role_description`,`event_roles`.`event_role_qualifications` AS `event_role_qualifications`,`event_roles`.`event_role_pre_mins` AS `event_role_pre_mins`,`event_roles`.`event_role_post_mins` AS `event_role_post_mins`,`event_roles`.`event_role_qty` AS `event_role_qty`,`event_roles`.`event_role_status` AS `event_role_status`,count(`event_role_volunteers`.`volunteer_id`) AS `vols` from (`event_roles` left join `event_role_volunteers` on((`event_roles`.`event_role_id` = `event_role_volunteers`.`event_role_id`))) group by `event_roles`.`event_role_id`,`event_roles`.`event_id`,`event_roles`.`event_role_title`,`event_roles`.`event_role_description`,`event_roles`.`event_role_qualifications`,`event_roles`.`event_role_pre_mins`,`event_roles`.`event_role_post_mins`,`event_roles`.`event_role_qty`,`event_roles`.`event_role_status`;

-- --------------------------------------------------------

--
-- Structure for view `vw_needs`
--
DROP TABLE IF EXISTS `vw_needs`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_needs` AS select 'need' AS `source`,`event_roles`.`event_id` AS `event_id`,sum(`event_roles`.`event_role_qty`) AS `qty` from `event_roles` group by `event_roles`.`event_id` union select 'have' AS `source`,`event_role_volunteers`.`event_id` AS `event_id`,count(`event_role_volunteers`.`volunteer_id`) AS `count(volunteer_id)` from `event_role_volunteers` group by `event_role_volunteers`.`event_id`;

-- --------------------------------------------------------

--
-- Structure for view `vw_need_summary`
--
DROP TABLE IF EXISTS `vw_need_summary`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_need_summary` AS select `vw_needs`.`event_id` AS `event_id`,sum((case when (`vw_needs`.`source` = 'need') then `vw_needs`.`qty` else 0 end)) AS `need`,sum((case when (`vw_needs`.`source` = 'have') then `vw_needs`.`qty` else 0 end)) AS `have` from `vw_needs` group by `vw_needs`.`event_id`;

-- --------------------------------------------------------

--
-- Structure for view `vw_volunteer_roles`
--
DROP TABLE IF EXISTS `vw_volunteer_roles`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_volunteer_roles` AS select `events`.`event_id` AS `event_id`,`event_roles`.`event_role_id` AS `event_role_id`,`event_role_volunteers`.`volunteer_id` AS `volunteer_id` from ((`events` join `event_roles` on((`events`.`event_id` = `event_roles`.`event_id`))) join `event_role_volunteers` on((`event_roles`.`event_role_id` = `event_role_volunteers`.`event_role_id`))) group by `events`.`event_id`,`event_roles`.`event_role_id`,`event_role_volunteers`.`volunteer_id`;

-- --------------------------------------------------------

--
-- Structure for view `vw_vol_events`
--
DROP TABLE IF EXISTS `vw_vol_events`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_vol_events` AS select `event_role_volunteers`.`event_id` AS `event_id`,`event_role_volunteers`.`volunteer_id` AS `volunteer_id` from `event_role_volunteers` group by `event_role_volunteers`.`event_id`,`event_role_volunteers`.`volunteer_id`;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
