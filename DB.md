## 1. 테이블 설계 및 정규화 (DDL)

### 문제 1: 테이블 생성하기 (CREATE TABLE)
* **Q1. 중복된 데이터가 쌓이는 컬럼은?**
    * `nickname`

* **Q2. `crew` 테이블 구성 제안:**
    * `crew_id`(PK)와 `nickname`으로 구성하여 데이터 중복을 방지한다.

* **Q3. 크루 정보 추출 쿼리:**
  ```sql
  SELECT DISTINCT crew_id, nickname FROM attendance;
  ```

* **Q4. 최종 `crew` 테이블 생성:**
  ```sql
  CREATE TABLE crew (
      crew_id INT NOT NULL,
      nickname VARCHAR(50) NOT NULL,
      PRIMARY KEY (crew_id)
  );
  ```

* **Q5. `crew` 테이블에 데이터 삽입:**
  ```sql
  INSERT INTO crew (crew_id, nickname)
  SELECT DISTINCT crew_id, nickname
  FROM attendance;
  ```

### 문제 2: 테이블 컬럼 삭제하기 (ALTER TABLE)
* **Q1. 불필요해진 컬럼은?**
    * `nickname`
* **Q2. 컬럼 삭제 쿼리:**
  ```sql
  ALTER TABLE attendance DROP COLUMN nickname;
  ```

### 문제 3: 외래키 설정하기 (Foreign Key)
* **데이터 무결성을 위한 외래키 설정:**
  ```sql
  ALTER TABLE attendance
  ADD CONSTRAINT fk_attendance_crew
  FOREIGN KEY (crew_id) REFERENCES crew(crew_id);
  ```

### 문제 4: 유니크 키 설정 (Unique Key)
* **닉네임 중복 방지를 위한 설정:**
  ```sql
  ALTER TABLE crew
  ADD CONSTRAINT uk_crew_nickname UNIQUE (nickname);
  ```

---

## 2. 데이터 조작 실습 (DML)

### 문제 5: 크루 닉네임 검색 (LIKE)
* **'디'로 시작하는 크루 찾기:**
  ```sql
  SELECT * FROM crew 
  WHERE nickname LIKE '디%';
  ```

### 문제 6: 출석 기록 확인 (SELECT + WHERE)
* **어셔의 3월 6일 기록 확인:**
  ```sql
  SELECT a.* FROM attendance a
  JOIN crew c ON a.crew_id = c.crew_id
  WHERE c.nickname = '어셔' AND a.attendance_date = '2025-03-06';
  ```

### 문제 7: 누락된 기록 추가 (INSERT)
* **어셔의 출석 정보 수동 추가:**
  ```sql
  INSERT INTO attendance (crew_id, attendance_date, start_time, end_time)
  VALUES (13, '2025-03-06', '09:31', '18:01');
  ```

### 문제 8: 잘못된 기록 수정 (UPDATE)
* **주니의 등교 시각 정정:**
  ```sql
  UPDATE attendance a
  JOIN crew c ON a.crew_id = c.crew_id
  SET a.start_time = '10:00'
  WHERE c.nickname = '주니' AND a.attendance_date = '2025-03-12';
  ```

### 문제 9: 허위 기록 삭제 (DELETE)
* **아론의 허위 출석 데이터 삭제:**
  ```sql
  DELETE a FROM attendance a
  JOIN crew c ON a.crew_id = c.crew_id
  WHERE c.nickname = '아론' AND a.attendance_date = '2025-03-12';
  ```

---

## 3. 고급 조회 및 집계 (JOIN & Group By)

### 문제 10: 출석 정보 조회 (JOIN)
* **닉네임을 포함한 전체 출석 기록 조회:**
  ```sql
  SELECT c.nickname, a.attendance_date, a.start_time, a.end_time
  FROM attendance a
  JOIN crew c ON a.crew_id = c.crew_id;
  ```

### 문제 11: 서브쿼리 활용
* **닉네임으로 크루 ID를 찾아 기록 조회:**
  ```sql
  SELECT * FROM attendance
  WHERE crew_id = (SELECT crew_id FROM crew WHERE nickname = '검프');
  ```

### 문제 12: 가장 늦게 하교한 크루 찾기 (ORDER BY + LIMIT)
  ```sql
  SELECT c.nickname, a.end_time
  FROM attendance a
  JOIN crew c ON a.crew_id = c.crew_id
  WHERE a.attendance_date = '2025-03-05'
  ORDER BY a.end_time DESC
  LIMIT 1;
  ```

---

### 문제 13: 크루별로 '기록된' 날짜 수 조회

* **각 크루별로 출석 테이블에 기록된 데이터가 총 몇 일치인지 확인하려면 어떻게 해야 하는가?:**

```sql
SELECT crew_id, COUNT(attendance_date) AS recorded_days
FROM attendance
GROUP BY crew_id;
```

### 문제 14: 크루별로 등교 기록이 있는 날짜 수 조회

* **단순히 행의 개수가 아니라, 실제로 등교 시각(`start_time`)이 기록된 날짜만 카운트하려면 어떻게 해야 하는가?:**

```sql
SELECT crew_id, COUNT(start_time) AS actual_attended_days
FROM attendance
WHERE start_time IS NOT NULL
GROUP BY crew_id;
```

### 문제 15: 날짜별로 등교한 크루 수 조회

* **특정 날짜에 캠퍼스에 총 몇 명의 크루가 등교했는지 날짜별로 집계하려면 어떻게 해야 하는가?:**

```sql
SELECT attendance_date, COUNT(crew_id) AS daily_crew_count
FROM attendance
GROUP BY attendance_date;
```

### 문제 16: 크루별 가장 빠른 등교 시각(MIN)과 가장 늦은 등교 시각(MAX)

* **각 크루가 전체 기간 중 가장 일찍 등교한 시각과 가장 늦게 등교한 시각을 한눈에 비교하려면 어떻게 해야 하는가?:**

```sql
SELECT 
    crew_id, 
    MIN(start_time) AS earliest_start, 
    MAX(start_time) AS latest_start
FROM attendance
GROUP BY crew_id;
```