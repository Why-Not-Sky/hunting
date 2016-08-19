truncate table indicator_definition;
insert into indicator_definition(idc_id, idc_name, idc_type, period, cycle) values (1, 'rsi:14日', 'rsi', 14, 'd');

insert into indicator_definition(idc_id, idc_name, idc_type, period, cycle) values (11, 'rsv:日', 'rsv', 1, 'd');
insert into indicator_definition(idc_id, idc_name, idc_type, period, cycle) values (12, 'rsv:周', 'rsv', 1, 'w');
insert into indicator_definition(idc_id, idc_name, idc_type, period, cycle) values (13, 'rsv:月', 'rsv', 1, 'm');
insert into indicator_definition(idc_id, idc_name, idc_type, period, cycle) values (14, 'rsv:季', 'rsv', 1, 'q');
insert into indicator_definition(idc_id, idc_name, idc_type, period, cycle) values (15, 'rsv:年', 'rsv', 1, 'y');

insert into indicator_definition(idc_id, idc_name, idc_type, period, cycle) values (21, 'kd:日', 'kd', 1, 'd');
insert into indicator_definition(idc_id, idc_name, idc_type, period, cycle) values (22, 'kd:周', 'kd', 1, 'w');
insert into indicator_definition(idc_id, idc_name, idc_type, period, cycle) values (23, 'kd:月', 'kd', 1, 'm');
insert into indicator_definition(idc_id, idc_name, idc_type, period, cycle) values (24, 'kd:季', 'kd', 1, 'q');
insert into indicator_definition(idc_id, idc_name, idc_type, period, cycle) values (25, 'kd:年', 'kd', 1, 'y');

select * from indicator_definition ;


