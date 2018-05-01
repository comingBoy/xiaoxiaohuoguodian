-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: 2018-02-01 08:01:07
-- 服务器版本： 5.7.18
-- PHP Version: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `orderSystem`
--

-- --------------------------------------------------------

--
-- 表的结构 `fooddb`
--

CREATE TABLE `fooddb` (
  `foodId` int(40) NOT NULL COMMENT '食物ID',
  `foodTypeId` int(40) NOT NULL COMMENT '种类ID',
  `foodName` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '食物名',
  `leastPrice` int(40) NOT NULL COMMENT '基本价格',
  `priceProperty` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '价格属性',
  `multiProperty` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '多选属性',
  `singleProperty` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '单选属性',
  `foodPhoto` text NOT NULL COMMENT '食物图片'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- 表的结构 `foodTypedb`
--

CREATE TABLE `foodTypedb` (
  `foodTypeId` int(40) NOT NULL COMMENT '种类ID',
  `foodTypeName` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '种类名'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- 表的结构 `orderdb`
--

CREATE TABLE `orderdb` (
  `orderId` int(40) NOT NULL COMMENT '订单ID',
  `tableId` int(40) NOT NULL COMMENT '桌位ID',
  `cost` int(40) NOT NULL COMMENT '订单金额',
  `date` varchar(40) NOT NULL COMMENT '订单日期',
  `time` varchar(40) NOT NULL COMMENT '订单时间'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- 表的结构 `orderFooddb`
--

CREATE TABLE `orderFooddb` (
  `orderFoodId` int(40) NOT NULL COMMENT '订单内容ID',
  `orderId` int(40) NOT NULL COMMENT '订单ID',
  `foodId` int(40) NOT NULL COMMENT '食物ID',
  `foodName` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '食物名',
  `orderNum` int(40) NOT NULL COMMENT '订单数量',
  `date` varchar(40) NOT NULL COMMENT '日期'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- 表的结构 `shopdb`
--

CREATE TABLE `shopdb` (
  `shopId` int(40) NOT NULL COMMENT '店铺ID',
  `shopName` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '店铺名',
  `shopLocation` text NOT NULL COMMENT '店铺位置',
  `ifOpen` int(10) NOT NULL COMMENT '是否营业',
  `openTime` varchar(40) NOT NULL COMMENT '营业时间'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `fooddb`
--
ALTER TABLE `fooddb`
  ADD PRIMARY KEY (`foodId`);

--
-- Indexes for table `foodTypedb`
--
ALTER TABLE `foodTypedb`
  ADD PRIMARY KEY (`foodTypeId`);

--
-- Indexes for table `orderdb`
--
ALTER TABLE `orderdb`
  ADD PRIMARY KEY (`orderId`);

--
-- Indexes for table `orderFooddb`
--
ALTER TABLE `orderFooddb`
  ADD PRIMARY KEY (`orderFoodId`);

--
-- Indexes for table `shopdb`
--
ALTER TABLE `shopdb`
  ADD PRIMARY KEY (`shopId`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `fooddb`
--
ALTER TABLE `fooddb`
  MODIFY `foodId` int(40) NOT NULL AUTO_INCREMENT COMMENT '食物ID';
--
-- 使用表AUTO_INCREMENT `foodTypedb`
--
ALTER TABLE `foodTypedb`
  MODIFY `foodTypeId` int(40) NOT NULL AUTO_INCREMENT COMMENT '种类ID';
--
-- 使用表AUTO_INCREMENT `orderdb`
--
ALTER TABLE `orderdb`
  MODIFY `orderId` int(40) NOT NULL AUTO_INCREMENT COMMENT '订单ID';
--
-- 使用表AUTO_INCREMENT `orderFooddb`
--
ALTER TABLE `orderFooddb`
  MODIFY `orderFoodId` int(40) NOT NULL AUTO_INCREMENT COMMENT '订单内容ID';
--
-- 使用表AUTO_INCREMENT `shopdb`
--
ALTER TABLE `shopdb`
  MODIFY `shopId` int(40) NOT NULL AUTO_INCREMENT COMMENT '店铺ID';COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
