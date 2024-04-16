# Socket.IO API 문서

### Socket.IO 연결 (Client -> Server)

새로운 사용자 연결
- 이벤트 이름: `connection`
- 매개변수:
  - `socket`: 연결을 나타내는 소켓 인스턴스

### 방 입장 (Client -> Server -> Room Client)

사용자가 특정 방에 입장. 최초 입장 유저는 방장 역할을 부여 받음. 방에 인원이 0명이 되지 않으면 재접속 하더라도 방장 권한이 유지됨.

- 이벤트 이름: `join_room`
- 매개변수:
  - `roomName`: 입장할 방의 이름
  - `token`: 사용자의 인증 토큰
  - `done`: 입장 후 실행할 콜백 함수
- 반환 이벤트:
  - `not_auth`: 사용자가 인증되지 않았을 경우 발생
  - `welcome`: 방에 새로운 사용자가 입장했다는 것을 다른 사용자에게 알림
  - `not_room_auth`: 사용자가 방에 입장할 권한이 없는 경우 발생

### Offer (Client -> Server -> Room Client)

특정 사용자에게 WebRTC 연결을 시작하기 위한 오퍼 전송

- 이벤트 이름: `offer`
- 매개변수: 
  - `targetId`: 대상 사용자의 소켓 ID
  - `offer`: WebRTC 오퍼 객체
- 반환 이벤트: 
  - [target 대상에게만] `offer`: 오퍼 내용

### Answer (Client -> Server -> Room Client)

전송 받은 오퍼에 대한 응답(답변)

- 이벤트 이름: `answer`
- 매개변수:
  - `targetId`: 대상 사용자의 소켓 ID
  - `answer`: WebRTC 응답 객체
- 반환 이벤트: 
  - [target 대상에게만] `answer`: 대상 사용자에게 응답을 전달합니다.

### Ice (Client -> Server -> Room Client)

특정 사용자에게 ICE 데이터 전송

- 이벤트 이름: `ice`
- 매개변수:
  - `targetId`: 대상 사용자의 소켓 ID
  - `ice`: ICE 데이터
- 반환 이벤트: 
  - [target 대상에게만] `ice`: 대상 사용자에게 ICE 후보 데이터를 전달
  
### [방장] 입장 사용자 설정 (Client -> Server)

방에 입장할 수 있는 사용자 목록 설정

- 이벤트 이름: `setAuthUser`
- 매개변수:
  - `userEmails`: 입장을 허가할 사용자들의 이메일 주소 배열
  - `roomName`: 방 이름
  - `done`: 성공 또는 실패 후 실행할 콜백 함수
- 반환 이벤트:
  - `done` 함수 실행

### tts 데이터 전송 (Client -> Server -> Room Client)

음성 인식을 통해 수집한 데이터를 서버에 전달. 서버에서 번역 과정을 거쳐 모든 사용자에게 전달

- 이벤트 이름: `trans`
- 매개변수:
  - `roomName`: 번역 요청이 이루어진 방의 이름
  - `text`: 번역할 텍스트
- 반환 이벤트:
  - `trans_return`: 방 참가자에게 번역된 텍스트를 전송

### 새로운 채팅 메시지 (Client -> Server -> Room Client)

사용자가 전송한 새로운 채팅

- 이벤트 이름: `new_message`
- 매개변수:
  - `msg`: 메시지 내용
  - `roomName`: 메시지가 전송될 방
  - `done`: 메시지 전송 후 실행될 콜백 함수
- 반환 이벤트:
  - `new_message`: 방의 다른 사용자에게 새 메시지를 전달

### 연결 해제 이벤트 (Server)

사용자가 연결을 해제할 때 자동으로 발생