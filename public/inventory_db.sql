-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 05, 2026 at 03:33 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `inventory_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `account_id` int(11) NOT NULL,
  `mat_id` int(11) DEFAULT NULL,
  `invoice_no` varchar(50) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`account_id`, `mat_id`, `invoice_no`, `price`) VALUES
(2, 12, 'INV001', 4500.00),
(3, 13, 'INV002', 8000.00),
(4, 14, 'INV003', 12000.00),
(5, 15, 'INV004', 3500.00),
(6, 16, 'INV005', 15000.00),
(7, 17, 'INV006', 6000.00);

-- --------------------------------------------------------

--
-- Table structure for table `finished_goods`
--

CREATE TABLE `finished_goods` (
  `product_id` int(11) NOT NULL,
  `product_name` varchar(100) DEFAULT NULL,
  `batch_number` varchar(50) DEFAULT NULL,
  `manufacturing_date` date DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `unit` varchar(20) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'in stock'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `finished_goods`
--

INSERT INTO `finished_goods` (`product_id`, `product_name`, `batch_number`, `manufacturing_date`, `expiry_date`, `quantity`, `unit`, `status`) VALUES
(1, 'Mango Juice 200ml', 'FG-BATCH001', '2026-04-01', '2026-10-01', 500, 'units', 'in stock'),
(2, 'Mango Juice 500ml', 'FG-BATCH002', '2026-04-01', '2026-10-01', 300, 'units', 'in stock'),
(3, 'Mixed Fruit Juice 200ml', 'FG-BATCH003', '2026-04-10', '2026-10-10', 450, 'units', 'in stock'),
(4, 'Mixed Fruit Juice 500ml', 'FG-BATCH004', '2026-04-10', '2026-10-10', 200, 'units', 'dispatched'),
(5, 'Guava Juice 200ml', 'FG-BATCH005', '2026-03-15', '2026-09-15', 350, 'units', 'in stock'),
(6, 'Pineapple Juice 200ml', 'FG-BATCH006', '2026-03-20', '2026-09-20', 180, 'units', 'dispatched'),
(7, 'Litchi Drink 200ml', 'FG-BATCH007', '2026-04-15', '2026-07-15', 120, 'units', 'in stock'),
(8, 'Orange Juice 500ml', 'FG-BATCH008', '2026-02-01', '2026-05-10', 50, 'units', 'in stock'),
(9, 'Mango Drink 1L', 'FG-BATCH009', '2026-04-20', '2026-10-20', 150, 'units', 'in stock'),
(10, 'Mixed Fruit Punch 200ml', 'FG-BATCH010', '2026-04-25', '2026-10-25', 300, 'units', 'in stock'),
(11, 'Guava Nectar 500ml', 'FG-BATCH011', '2026-03-01', '2026-05-08', 40, 'units', 'in stock');

-- --------------------------------------------------------

--
-- Table structure for table `production`
--

CREATE TABLE `production` (
  `request_id` int(11) NOT NULL,
  `mat_id` int(11) DEFAULT NULL,
  `quantity_requested` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `status` varchar(20) DEFAULT 'pending',
  `truck_number` varchar(50) DEFAULT NULL,
  `driver_name` varchar(100) DEFAULT NULL,
  `loadout_condition` varchar(20) DEFAULT NULL,
  `dispatch_notes` varchar(255) DEFAULT NULL,
  `dispatch_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `production`
--

INSERT INTO `production` (`request_id`, `mat_id`, `quantity_requested`, `date`, `status`, `truck_number`, `driver_name`, `loadout_condition`, `dispatch_notes`, `dispatch_date`) VALUES
(2, 12, 50, '2026-05-01', 'dispatched', 'AS01AB1234', 'Raju Das', 'Good', 'Delivered on time', '2026-05-01'),
(3, 13, 30, '2026-05-02', 'approved', NULL, NULL, NULL, NULL, NULL),
(4, 14, 5, '2026-05-03', 'approved', NULL, NULL, NULL, NULL, NULL),
(5, 17, 40, '2026-05-04', 'approved', NULL, NULL, NULL, NULL, NULL),
(6, 15, 100, '2026-05-04', 'dispatched', 'AS02CD5678', 'Bikash Kalita', 'Good', 'No issues', '2026-05-04'),
(7, 12, 75, '2026-05-06', 'approved', NULL, NULL, NULL, NULL, NULL),
(8, 13, 25, '2026-05-07', 'approved', NULL, NULL, NULL, NULL, NULL),
(9, 17, 60, '2026-05-08', 'pending', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `purchase_orders`
--

CREATE TABLE `purchase_orders` (
  `order_id` int(11) NOT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `mat_id` int(11) DEFAULT NULL,
  `quantity_ordered` int(11) DEFAULT NULL,
  `unit` varchar(20) DEFAULT NULL,
  `expected_delivery` date DEFAULT NULL,
  `actual_delivery` date DEFAULT NULL,
  `status` varchar(20) DEFAULT 'ordered',
  `notes` varchar(255) DEFAULT NULL,
  `new_material_name` varchar(100) DEFAULT NULL,
  `batch_number` varchar(50) DEFAULT NULL,
  `manufacturing_date` date DEFAULT NULL,
  `expiry_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchase_orders`
--

INSERT INTO `purchase_orders` (`order_id`, `supplier_id`, `mat_id`, `quantity_ordered`, `unit`, `expected_delivery`, `actual_delivery`, `status`, `notes`, `new_material_name`, `batch_number`, `manufacturing_date`, `expiry_date`) VALUES
(1, 3, 12, 200, 'kg', '2026-05-10', '2026-05-09', 'received', 'Regular monthly order', NULL, 'BATCH009', '2026-05-01', '2027-05-01'),
(2, 4, 13, 100, 'litres', '2026-05-12', '2026-05-05', 'received', 'Urgent - low stock', NULL, 'BATCH010', '2026-05-02', '2026-11-02'),
(3, 6, 14, 50, 'kg', '2026-05-15', NULL, 'ordered', NULL, NULL, 'BATCH011', '2026-05-03', '2026-08-03'),
(4, 5, 15, 1000, 'units', '2026-05-20', NULL, 'ordered', 'Bulk order', NULL, 'BATCH012', '2026-05-01', '2028-05-01'),
(5, 3, NULL, 150, 'kg', '2026-05-18', NULL, 'ordered', 'New material trial', 'Raw Mango Pulp', 'BATCH013', '2026-05-05', '2026-09-05'),
(6, 6, 16, 20, 'kg', '2026-05-08', '2026-05-08', 'received', 'Restock', NULL, 'BATCH014', '2026-04-01', '2026-10-01'),
(7, 4, 18, 500, 'ml', '2026-05-25', NULL, 'cancelled', NULL, NULL, 'BATCH015', '2026-05-10', '2026-11-10');

-- --------------------------------------------------------

--
-- Table structure for table `raw_material`
--

CREATE TABLE `raw_material` (
  `mat_id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `unit` varchar(20) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `batch_number` varchar(50) DEFAULT NULL,
  `manufacturing_date` date DEFAULT NULL,
  `expiry_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `raw_material`
--

INSERT INTO `raw_material` (`mat_id`, `name`, `unit`, `quantity`, `supplier_id`, `batch_number`, `manufacturing_date`, `expiry_date`) VALUES
(12, 'Sugar', 'kg', 150, 3, 'BATCH001', '2026-01-01', '2027-01-01'),
(13, 'Fruit Pulp', 'litres', 180, 4, 'BATCH010', '2026-05-02', '2026-11-02'),
(14, 'Preservatives', 'kg', 8, 6, 'BATCH003', '2025-12-01', '2026-06-01'),
(15, 'Packaging Material', 'units', 500, 5, 'BATCH004', '2026-01-15', '2027-06-01'),
(16, 'Citric Acid', 'kg', 5, 6, 'BATCH005', '2025-11-01', '2026-05-20'),
(17, 'Sugar Syrup', 'litres', 120, 3, 'BATCH006', '2026-02-01', '2026-09-01'),
(18, 'Fruit Essence', 'ml', 45, 4, 'BATCH007', '2026-01-10', '2026-07-10'),
(19, 'Glass Bottles', 'units', 1000, 5, 'BATCH008', '2026-01-01', '2028-01-01');

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `report_id` int(11) NOT NULL,
  `report_type` varchar(50) DEFAULT NULL,
  `generated_date` date DEFAULT NULL,
  `generated_by` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `supplier`
--

CREATE TABLE `supplier` (
  `supplier_id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `contact` varchar(20) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `supplier`
--

INSERT INTO `supplier` (`supplier_id`, `name`, `contact`, `address`) VALUES
(3, 'Assam Agro Traders', '9854012345', 'Guwahati, Assam'),
(4, 'North East Food Supplies', '9435067890', 'Tezpur, Assam'),
(5, 'Brahmaputra Packaging Co.', '9678123456', 'Mangaldai, Assam'),
(6, 'Bengal Chemical Traders', '9331098765', 'Kolkata, West Bengal'),
(7, 'Deka & Sons Trading', '9864532100', 'Darrang, Assam');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`account_id`),
  ADD KEY `mat_id` (`mat_id`);

--
-- Indexes for table `finished_goods`
--
ALTER TABLE `finished_goods`
  ADD PRIMARY KEY (`product_id`);

--
-- Indexes for table `production`
--
ALTER TABLE `production`
  ADD PRIMARY KEY (`request_id`),
  ADD KEY `mat_id` (`mat_id`);

--
-- Indexes for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `supplier_id` (`supplier_id`),
  ADD KEY `mat_id` (`mat_id`);

--
-- Indexes for table `raw_material`
--
ALTER TABLE `raw_material`
  ADD PRIMARY KEY (`mat_id`),
  ADD KEY `supplier_id` (`supplier_id`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`report_id`);

--
-- Indexes for table `supplier`
--
ALTER TABLE `supplier`
  ADD PRIMARY KEY (`supplier_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `account_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `finished_goods`
--
ALTER TABLE `finished_goods`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `production`
--
ALTER TABLE `production`
  MODIFY `request_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `raw_material`
--
ALTER TABLE `raw_material`
  MODIFY `mat_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `report_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `supplier`
--
ALTER TABLE `supplier`
  MODIFY `supplier_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accounts`
--
ALTER TABLE `accounts`
  ADD CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`mat_id`) REFERENCES `raw_material` (`mat_id`);

--
-- Constraints for table `production`
--
ALTER TABLE `production`
  ADD CONSTRAINT `production_ibfk_1` FOREIGN KEY (`mat_id`) REFERENCES `raw_material` (`mat_id`);

--
-- Constraints for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  ADD CONSTRAINT `purchase_orders_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`supplier_id`),
  ADD CONSTRAINT `purchase_orders_ibfk_2` FOREIGN KEY (`mat_id`) REFERENCES `raw_material` (`mat_id`);

--
-- Constraints for table `raw_material`
--
ALTER TABLE `raw_material`
  ADD CONSTRAINT `raw_material_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`supplier_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
