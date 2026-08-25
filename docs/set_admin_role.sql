-- ให้สิทธิ์ admin แก่ผู้ใช้ (รันหลัง `npx prisma db push`)
-- เปลี่ยน 'you@example.com' เป็นอีเมลของผู้ใช้ที่ต้องการ
UPDATE `user` SET `role` = 'admin' WHERE `email` = 'you@example.com';
