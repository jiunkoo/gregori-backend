-- 더미 카테고리 데이터
INSERT INTO categories (name) VALUES 
('전자제품'),
('의류'),
('도서'),
('식품'),
('스포츠용품'),
('가구'),
('화장품'),
('자동차용품');

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
INSERT INTO products (seller_id, category_id, name, price, inventory, status, is_deleted) VALUES 
-- 전자제품 (카테고리 1)
(1, 1, '케이폰 7 라이트', 1590000, 40, 'ON_SALE', 'FALSE'),
(1, 1, '케이폰 7 프로', 1990000, 30, 'ON_SALE', 'FALSE'),
(1, 1, '케이북 14 라이트', 1990000, 25, 'ON_SALE', 'FALSE'),
(1, 1, '케이북 14 프로', 2990000, 18, 'ON_SALE', 'FALSE'),
(1, 1, '케이패드 10 에어', 1190000, 50, 'ON_SALE', 'FALSE'),
(1, 1, '케이패드 10 프로', 1990000, 30, 'ON_SALE', 'FALSE'),
(1, 1, '케이뷰 32 라이트 4K 허브 모니터', 600000, 70, 'ON_SALE', 'FALSE'),
(1, 1, '케이뷰 32 프로 4K 허브 모니터', 1300000, 40, 'ON_SALE', 'FALSE'),
(1, 1, '케이레드 50 TV', 2190000, 20, 'ON_SALE', 'FALSE'),
(1, 1, '케이레드 65 EVO TV', 4190000, 15, 'ON_SALE', 'FALSE'),
(1, 1, '케이프레시 냉장고 870L', 2030000, 18, 'ON_SALE', 'FALSE'),
(1, 1, '케이워시 세탁기 25Kg', 1290000, 25, 'ON_SALE', 'FALSE'),

-- 의류 (카테고리 2)
(2, 2, '남녀공용 검정 슬랙스', 139000, 250, 'ON_SALE', 'FALSE'),
(2, 2, '남녀공용 흰 셔츠', 109000, 220, 'ON_SALE', 'FALSE'),
(2, 2, '남녀공용 줄무늬 셔츠', 149000, 100, 'ON_SALE', 'FALSE'),
(2, 2, '남성용 해링본 자켓', 590000, 35, 'ON_SALE', 'FALSE'),
(2, 2, '남성용 세무패치 하운드투스 자켓', 590000, 40, 'ON_SALE', 'FALSE'),
(2, 2, '남성용 퀼팅 누빔 자켓', 790000, 25, 'ON_SALE', 'FALSE'),
(2, 2, '여성용 화이트카라 블랙 셔츠', 199000, 100, 'ON_SALE', 'FALSE'),
(2, 2, '여성용 콜롬보 캐시미어 롱 코트', 2600000, 30, 'ON_SALE', 'FALSE'),
(2, 2, '여성용 프릴 셔츠', 219000, 35, 'ON_SALE', 'FALSE'),
(2, 2, '여성용 트위드 자켓', 499000, 80, 'ON_SALE', 'FALSE'),
(2, 2, '여성용 트위드 스커트', 499000, 80, 'ON_SALE', 'FALSE'),

-- -- 도서 (카테고리 3)
-- (1, 3, '프로그래밍 입문서', 25000, 200, 'ON_SALE', 'FALSE'),
-- (1, 3, '소설 - 해리포터 시리즈', 15000, 150, 'ON_SALE', 'FALSE'),
-- (1, 3, '요리책 - 홈베이킹', 22000, 80, 'ON_SALE', 'FALSE'),
-- (1, 3, '자기계발서 - 성공하는 사람들의 7가지 습관', 18000, 120, 'ON_SALE', 'FALSE'),
-- (1, 3, '여행 가이드북', 12000, 100, 'ON_SALE', 'FALSE'),

-- -- 식품 (카테고리 4)
-- (2, 4, '유기농 과일 세트', 35000, 50, 'ON_SALE', 'FALSE'),
-- (2, 4, '견과류 믹스', 15000, 100, 'ON_SALE', 'FALSE'),
-- (2, 4, '홈메이드 쿠키', 8000, 200, 'ON_SALE', 'FALSE'),
-- (2, 4, '프리미엄 커피 원두', 25000, 80, 'ON_SALE', 'FALSE'),
-- (2, 4, '건강식품 비타민', 45000, 60, 'ON_SALE', 'FALSE'),

-- -- 스포츠용품 (카테고리 5)
-- (1, 5, '요가 매트', 25000, 150, 'ON_SALE', 'FALSE'),
-- (1, 5, '덤벨 세트', 120000, 40, 'ON_SALE', 'FALSE'),
-- (1, 5, '축구공', 35000, 80, 'ON_SALE', 'FALSE'),
-- (1, 5, '테니스 라켓', 180000, 30, 'ON_SALE', 'FALSE'),
-- (1, 5, '등산용품 세트', 250000, 25, 'ON_SALE', 'FALSE'),

-- -- 가구 (카테고리 6)
-- (2, 6, '소파 3인용', 450000, 15, 'ON_SALE', 'FALSE'),
-- (2, 6, '책상 세트', 180000, 30, 'ON_SALE', 'FALSE'),
-- (2, 6, '침대 프레임', 350000, 20, 'ON_SALE', 'FALSE'),
-- (2, 6, '옷장 3단', 280000, 25, 'ON_SALE', 'FALSE'),
-- (2, 6, '식탁 세트', 320000, 18, 'ON_SALE', 'FALSE'),

-- -- 화장품 (카테고리 7)
-- (1, 7, '기초화장품 세트', 89000, 100, 'ON_SALE', 'FALSE'),
-- (1, 7, '립스틱', 25000, 200, 'ON_SALE', 'FALSE'),
-- (1, 7, '마스크팩 10장', 15000, 300, 'ON_SALE', 'FALSE'),
-- (1, 7, '선크림', 35000, 150, 'ON_SALE', 'FALSE'),
-- (1, 7, '향수', 120000, 50, 'ON_SALE', 'FALSE'),

-- -- 자동차용품 (카테고리 8)
-- (2, 8, '카시트', 180000, 40, 'ON_SALE', 'FALSE'),
-- (2, 8, '네비게이션', 250000, 30, 'ON_SALE', 'FALSE'),
-- (2, 8, '카매트 세트', 45000, 100, 'ON_SALE', 'FALSE'),
-- (2, 8, '블루투스 핸즈프리', 35000, 80, 'ON_SALE', 'FALSE'),
-- (2, 8, '자동차 청소용품 세트', 28000, 120, 'ON_SALE', 'FALSE'); 