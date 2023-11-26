## 마음연구소 기업과제
### 목차
 - [설치 및 실행방법](#설치-및-실행방법) 
 - [ERD](#ERD)   
 - [GraphQL API ](#GraphQL-API )   
4. [title4](#example)   
    - [❓ EASYME.md가 뭐예요?](#-easymemd가-뭐예요)   
    - [🛠 기능 엿보기](#-기능-엿보기)

## 설치 및 실행방법

1.설치 방법
```bash
$ git clone https://github.com/yisuho/maum_lab_survey.git
$ cd maum-lab-survey
$ yarn install
```

2.환경변수 설정
```bash
PORT=4000 
DATABASE_HOST=localhost
DATABASE_USER=postgres
DATABASE_NAME=maum_survey
DATABASE_PASSWORD=maumsurvey
DATABASE_PORT=5432
```

3.실행방법

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev
```

## ERD
![스크린샷 2023-11-26 오후 9 08 05](https://github.com/yisuho/maum_lab_survey/assets/105371325/10ce9e94-195a-4894-ae39-ad63a5e64790)


## GraphQL API 
#### - 설문지 CRUD

<details><summary>
설문지 생성
</summary>

* 제목(title),설명(description),꼬리말(footer)의 데이터를 입력하여 설문지를 생성합니다.

### 쿼리
```graphql
  mutation{
    createSurvey(createSurveyInput:{
      title:"마음연구소 설문지",
      description:"마음연구소 설문지입니다."
      footer:"감사합니다."
    }){
      id
      title
      description
      footer
    }
  }
```

### 결과
```graphql
  {
  "data": {
    "createSurvey": {
      "id": 1,
      "title": "마음연구소 설문지",
      "description": "마음연구소 설문지입니다.",
      "footer": "감사합니다."
    }
  }
}
```


</details>
<details><summary>
설문지 전체 조회
</summary>

* 생성된 설문지를 전체를 조회합니다.

### 쿼리
```graphql
query{
  surveys{
    id
    title
    description
    footer
  }
}
```

### 결과
```graphql
{
  "data": {
    "surveys": [
      {
        "id": 11,
        "title": "마음연구소 설문지",
        "description": "마음연구소 설문지입니다.",
        "footer": "감사합니다."
      },
      {
        "id": 2,
        "title": "마음연구소 두번째 설문지",
        "description": "마음연구소 두번째 설문지입니다.",
        "footer": "감사합니다."
      },
      {
        "id": 3,
        "title": "마음연구소 세번째 설문지",
        "description": "마음연구소 세번째 설문지입니다.",
        "footer": "감사합니다"
      },
    ]
  }
}
```

</details>

<details><summary>
설문지 단일 조회
</summary>

* 설문지의 Id 값을 입력하여 특정 설문지를 조회합니다.
* 해당 설문지에 포함된 모든 문항과 선택지 데이터를 함께 조회할 수 있습니다.
* 해당 설문지의 유무를 확인합니다.

Error Message
```
'해당 설문지가 없습니다'
```

### 쿼리
```graphql
  query{
  survey(id:1){
    id
    title
    description
    footer
    question{
      id
      questionNumber
      content
      choice{
        id
        choiceNumber
        content
        point
      }
    }
  }
}
```

### 결과
```graphQL
{
  "data": {
    "survey": {
      "id": 1,
      "title": "마음연구소 설문지",
      "description": "마음연구소 설문지입니다.",
      "footer": "감사합니다.",
      "question": [
        {
          "id": 1,
          "questionNumber": 1,
          "content": "첫번째 문항입니다.",
          "choice": [
            {
              "id": 1,
              "choiceNumber": 1,
              "content": "첫번째 문항 1번 선택지 입니다.",
              "point": 1
            },
            {
              "id": 2,
              "choiceNumber": 2,
              "content": "첫번째 문항 2번 선택지 입니다.",
              "point": 2
            },
            {
              "id": 3,
              "choiceNumber": 3,
              "content": "첫번째 문항 3번 선택지 입니다.",
              "point": 3
            }
          ]
        },
      ]
    }
  }
}
```
</details>

<details><summary>
설문지 수정
</summary>

* 제목(title), 설명(description), 꼬리말(footer)을 변경하려는 설문지의 ID를 입력한 후, 새로운 제목, 설명, 꼬리말을 입력하여 해당 설문지의 데이터를 수정할 수 있습니다.
* 해당 설문지의 유무를 확인합니다.

Error Message
```
'해당 설문지가 없습니다'
```

### 쿼리
```graphql
mutation{
  updateSurvey(updateSurveyInput:{
    id:1,
    title:"마음연구소"
    description:"마음연구소"
    footer:"끝."
  }),{
    id
    title
    description
    footer
  }
}
```

### 결과
```graphql
{
  "data": {
    "updateSurvey": {
      "id": 1,
      "title": "마음연구소",
      "description": "마음연구소",
      "footer": "끝."
    }
  }
}
```


</details>

<details><summary>
설문지 삭제
</summary>

* 설문지의 Id 값을 입력하여 특정 설문지를 삭제합니다.
* 삭제에 성공 하면 **true** 값을 반환하고 실패하면 **false** 값을 반환 합니다.

### 쿼리
```graphql
mutation{
  removeSurvey(id:1)
}
```

### 결과
```graphql
{
  "data": {
    "removeSurvey": true
  }
}
```


</details>

#### - 문항 CRUD

<details><summary>
문항 생성
</summary>

* 소속된 설문지의 ID(parentsSurveyId), 문항 번호(questionNumber), 그리고 문항 내용(content)을 입력하여 새로운 문항을 생성합니다.
* 문항 생성 시, 해당 설문지 내에 동일한 문항 번호와 내용의 유무를 중복 검사하여 확인합니다.

Error Message
```
'설문지에 같은 번호의 문제가 이미 존재합니다. 번호를 변경하세요'
'설문지에 같은 내용의 문제가 이미 존재합니다. 내용를 변경하세요'
```

### 쿼리
```graphql
 mutation{
  createQuestion(createQuestionInput:{
    parentsSurveyId:1,
    questionNumber:1,
    content:"첫번째 문항 입니다."
  }){
    id
    questionNumber
    content
  }
}
```

### 결과
```graphql
{
  "data": {
    "createQuestion": {
      "id": 1,
      "questionNumber": 1,
      "content": "첫번째 문항 입니다."
    }
  }
}
```


</details>

<details><summary>
문항 단일 조회
</summary>

* 문항의 Id 값을 입력하여 특정 문항을 조회합니다.
* 해당 문항에 포함된 선택지 와 문항이 포함된 설문지에 대한 데이터를 함께 조회 할 수 있습니다.
* 해당 문항의 유무를 확인합니다.

Error Message
```
해당 ID:${id} 를 가진 문제가 없습니다.
```

### 쿼리
```graphql
query{
  question(id:1){
    id
    parentsSurvey{
      id
      title
      description
      footer
    }
    id
    questionNumber
    content
    choice{
      choiceNumber
      content
      point
    }
  }
}
```

### 결과
```graphql
{
  "data": {
    "question": {
      "id": 1,
      "parentsSurvey": {
        "id": 1,
        "title": "마음연구소",
        "description": "마음연구소",
        "footer": "끝."
      },
      "questionNumber": 1,
      "content": "첫번째 문항 입니다.",
      "choice": [
        {
          "id": 1,
          "choiceNumber": 1,
          "content": "첫번째 문항 1번 선택지 입니다.",
          "point": 1
        },
        {
          "id": 2,
          "choiceNumber": 2,
          "content": "첫번째 문항 2번 선택지 입니다.",
          "point": 2
        },
        {
          "id": 3,
          "choiceNumber": 3,
          "content": "1번 문제 3번 선택지 입니다.",
          "point": 3
        }
      ]
    }
  }
}
```


</details>

<details><summary>
설문지에 포함된 문항 조회
</summary>

* 설문지 ID를 입력하면, 해당 설문지에 포함된 모든 문항을 조회할 수 있습니다.

### 쿼리
```graphql
query{
  findQuestionIncludSurvey(parentsSurveyId:1){
    id
    questionNumber
    content
  }
}
```

### 결과
```graphql
{
  "data": {
    "findQuestionIncludSurvey": [
      {
        "id": 1,
        "questionNumber": 1,
        "content": "첫번째 문항 입니다."
      },
      {
        "id": 2,
        "questionNumber": 2,
        "content": "두번째 문항 입니다."
      },
      {
        "id": 3,
        "questionNumber": 3,
        "content": "세번째 문항 입니다."
      }
    ]
  }
}
```

</details>

<details><summary>
문항 수정
</summary>

* 문항 번호 (questionNumber), 문항 내용(content) 을 변경하려는 문항의 ID를 입력한 후, 문항 번호, 문항 내용을 입력하여 해당 설문지의 데이터를 수정할 수 있습니다.
* 문항을 수정시, 해당 설문지 내에 동일한 문항 번호와 내용의 유무를 중복 검사하여 확인합니다.

* 해당 문항의 유무를 확인합니다.

Error Message
```
유무 확인
'해당 ID:${id} 를 가진 문제가 없습니다.'

중복확인 
'설문지에 같은 번호의 문제가 이미 존재합니다. 번호를 변경하세요'
'설문지에 같은 내용의 문제가 이미 존재합니다. 내용를 변경하세요'
```

### 쿼리
```graphql
mutation{
  updateQuestion(updateQuestionInput:{
    id:1,
    questionNumber:1,
    content:"1번 문항"
  }){
    id
    questionNumber
    content
  }
}
```

### 결과
```graphql
{
  "data": {
    "updateQuestion": {
      "id": 1,
      "questionNumber": 1,
      "content": "1번 문항"
    }
  }
}
```
</details>


<details><summary>
문항 삭제
</summary>

* 문항의 Id 값을 입력하여 특정 문항을 삭제합니다.
* 삭제에 성공 하면 **true** 값을 반환하고 실패하면 **false** 값을 반환 합니다.

### 쿼리
```graphql
mutation{
  removeQuestion(id:1)
}
```

### 결과
```graphql
{
  "data": {
    "removeSurvey": true
  }
}
```


</details>



