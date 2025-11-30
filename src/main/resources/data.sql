-- 더미 카테고리 데이터
INSERT INTO categories (name) VALUES 
('전자제품'),
('의류');

-- 더미 회원 데이터 (비밀번호: aa11111!)
INSERT INTO members (name, email, password, authority, is_deleted) VALUES 
('관리자', 'admin@gregori.com', '$2a$10$tCO5vniqaJSDesds5eUtWOIBmgXPSxi6jvqm1QnAK80uJ9G5Rq1Fu', 'ADMIN_MEMBER', 'FALSE'),
('판매자1', 'seller1@gregori.com', '$2a$10$tCO5vniqaJSDesds5eUtWOIBmgXPSxi6jvqm1QnAK80uJ9G5Rq1Fu', 'SELLING_MEMBER', 'FALSE'),
('판매자2', 'seller2@gregori.com', '$2a$10$tCO5vniqaJSDesds5eUtWOIBmgXPSxi6jvqm1QnAK80uJ9G5Rq1Fu', 'SELLING_MEMBER', 'FALSE'),
('일반회원1', 'user1@gregori.com', '$2a$10$tCO5vniqaJSDesds5eUtWOIBmgXPSxi6jvqm1QnAK80uJ9G5Rq1Fu', 'GENERAL_MEMBER', 'FALSE'),
('일반회원2', 'user2@gregori.com', '$2a$10$tCO5vniqaJSDesds5eUtWOIBmgXPSxi6jvqm1QnAK80uJ9G5Rq1Fu', 'GENERAL_MEMBER', 'FALSE');

-- 더미 판매자 데이터
INSERT INTO sellers (member_id, business_number, business_name, is_deleted) VALUES 
(2, '123-45-67890', '테크샵', 'FALSE'),
(3, '234-56-78901', '패션스토어', 'FALSE');

-- 더미 상품 데이터
INSERT INTO products (seller_id, category_id, name, price, inventory, image_url, status, is_deleted) VALUES 
-- 전자제품 (카테고리 1)
(1, 1, '케이폰 7 라이트', 1590000, 40, 'http://localhost:8080/images/digital-kphone-7-lite.png', 'ON_SALE', 'FALSE'),
(1, 1, '케이폰 7 프로', 1990000, 30, 'http://localhost:8080/images/digital-kphone-7-pro.png', 'ON_SALE', 'FALSE'),
(1, 1, '케이북 14 라이트', 1990000, 25, 'http://localhost:8080/images/digital-kbook-14-lite.png', 'ON_SALE', 'FALSE'),
(1, 1, '케이북 14 프로', 2990000, 18, 'http://localhost:8080/images/digital-kbook-14-pro.png', 'ON_SALE', 'FALSE'),
(1, 1, '케이패드 10 에어', 1190000, 50, 'http://localhost:8080/images/digital-kpad-10-air.png', 'ON_SALE', 'FALSE'),
(1, 1, '케이패드 10 프로', 1990000, 30, 'http://localhost:8080/images/digital-kpad-10-pro.png', 'ON_SALE', 'FALSE'),
(1, 1, '케이뷰 32 라이트 4K 허브 모니터', 600000, 70, 'http://localhost:8080/images/digital-kview-32-lite.png', 'ON_SALE', 'FALSE'),
(1, 1, '케이뷰 32 프로 4K 허브 모니터', 1300000, 40, 'http://localhost:8080/images/digital-kview-32-pro.png', 'ON_SALE', 'FALSE'),
(1, 1, '케이레드 50 TV', 2190000, 20, 'http://localhost:8080/images/digital-kled-50.png', 'ON_SALE', 'FALSE'),
(1, 1, '케이레드 65 EVO TV', 4190000, 15, 'http://localhost:8080/images/digital-kled-65-evo.png', 'ON_SALE', 'FALSE'),
(1, 1, '케이프레시 냉장고 870L', 2030000, 18, 'http://localhost:8080/images/digital-kfresh-879l.png', 'ON_SALE', 'FALSE'),
(1, 1, '케이워시 세탁기 25Kg', 1290000, 25, 'http://localhost:8080/images/digital-kwash-25kg.png', 'ON_SALE', 'FALSE'),

-- 의류 (카테고리 2)
(2, 2, '남녀공용 검정 슬랙스', 139000, 250, 'http://localhost:8080/images/clothes-comman-black-pant.png', 'ON_SALE', 'FALSE'),
(2, 2, '남녀공용 흰 셔츠', 109000, 220, 'http://localhost:8080/images/clothes-comman-white-shirt.png', 'ON_SALE', 'FALSE'),
(2, 2, '남녀공용 줄무늬 셔츠', 149000, 100, 'http://localhost:8080/images/clothes-common-stripe-shirt.png', 'ON_SALE', 'FALSE'),
(2, 2, '남성용 해링본 자켓', 590000, 35, 'http://localhost:8080/images/clothes-man-harringbone-jacket.png', 'ON_SALE', 'FALSE'),
(2, 2, '남성용 세무패치 하운드투스 자켓', 590000, 40, 'http://localhost:8080/images/clothes-man-houndtooth-jacket.png', 'ON_SALE', 'FALSE'),
(2, 2, '남성용 퀼팅 누빔 자켓', 790000, 25, 'http://localhost:8080/images/clothes-man-quilting-jacket.png', 'ON_SALE', 'FALSE'),
(2, 2, '여성용 화이트카라 블랙 셔츠', 199000, 100, 'http://localhost:8080/images/clothes-woman-black-shirt.png', 'ON_SALE', 'FALSE'),
(2, 2, '여성용 콜롬보 캐시미어 롱 코트', 2600000, 30, 'http://localhost:8080/images/clothes-woman-colombo-coat.png', 'ON_SALE', 'FALSE'),
(2, 2, '여성용 프릴 셔츠', 219000, 35, 'http://localhost:8080/images/clothes-woman-frill-shirt.png', 'ON_SALE', 'FALSE'),
(2, 2, '여성용 트위드 자켓', 499000, 80, 'http://localhost:8080/images/clothes-woman-tweed-jacket.png', 'ON_SALE', 'FALSE'),
(2, 2, '여성용 트위드 스커트', 499000, 80, 'http://localhost:8080/images/clothes-woman-tweed-skirt.png', 'ON_SALE', 'FALSE');
