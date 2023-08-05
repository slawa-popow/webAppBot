/* структура теперешней корзины на 04.04.2023*/

CREATE TABLE IF NOT EXISTS `e110kw29_kitopt`.`User_{table_name}` 
( `id` INT NOT NULL AUTO_INCREMENT , 
`product_id` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL, 
`photo` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL, 
`user_id` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL , 
`user_name` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL , 
`uniq_token` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL , 
`name` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL , 
`datetime` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL , 
`category` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL , 
`data_type` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL , 
`brand` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL , 
`name_good` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL , 
`characteristic` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL , 
`count_on_stock` INT NOT NULL , 
`count_on_order` INT NOT NULL ,
`count_on_order_cats` INT NOT NULL , 
`current_price` DOUBLE NOT NULL, 
`price_from_1to2` DOUBLE NOT NULL , 
`price_from_3to4` DOUBLE NOT NULL , 
`price_from_5to9` DOUBLE NOT NULL , 
`price_from_10to29` DOUBLE NOT NULL , 
`price_from_30to69` DOUBLE NOT NULL , 
`price_from_70to149` DOUBLE NOT NULL , 
`price_from_150` DOUBLE NOT NULL , 
`sum_position` DOUBLE NOT NULL , 
`delivery_method` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL , 
`price_delivery` DOUBLE NOT NULL , 
`address_delivery` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL , 
`time_delivery` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL ,
`pay_method` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL , 
`pay_status` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL , 
`order_status` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL , 
PRIMARY KEY (`id`)) ENGINE = InnoDB;

/* ИНЗЕРТ */

