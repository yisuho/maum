## 마음연구소 기업과제
### 목차
 - [설치 및 실행방법](#설치-및-실행방법) 
 - [ERD](#ERD)   
 - [GraphQL API ](#GraphQL-API )   
    - [설문지 CRUD](####--설문지-CRUD)   
    - [문항 CRUD](####--문항-CRUD)
    - [선택지 CRUD](####--선택지-CRUD)
    - [답변 CRUD](####--답변-CRUD)
    - [완료된 설문지 확인](####--완료된-설문지-확인)

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

*설문지의 ID를 입력한 후,  제목(title), 설명(description), 꼬리말(footer)을 입력하여 해당 설문지의 데이터를 수정할 수 있습니다.
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
* 문항이 포함된 설문지와 해당 문항에 포함된 선택지에 대한 데이터를 함께 조회 할 수 있습니다.
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
설문지에 포함된 문항 조회
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

*  문항의 ID를 입력한 후, 문항 번호 (questionNumber), 문항 내용(content)을 입력하여 해당 설문지의 데이터를 수정할 수 있습니다.
* 문항을 수정시, 해당 설문지 내에 본인을 제외한 동일한 문항 번호와 내용의 유무를 중복 검사하여 확인합니다.

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


#### - 선택지 CRUD

<details><summary>
설문지 생성
</summary>

* 소속된 문항의 ID(parentsQuestionId), 선택지 번호(choiceNumber), 선택지 내용(content),선택지 점수(point)를 입력하여 새로운 문항을 생성합니다.
* 선택지 생성 시, 해당 문항 내에 동일한 선택지 번호,내용,점수의 유무를 중복 검사하여 확인합니다.

Error Message
```
'문제에 동일한 보기번호가 존재합니다,보기번호를 변경하세요'
'문제에 동일한 점수의 번호가 존재합니다,점수를 변경하세요'
'문제에 동일한 보기내용이 존재합니다,보기내용을변경하세요'
```


### 쿼리
```graphql
mutation{
  createChoice(createChoiceInput:{
    parentsQuestionId:1,
    choiceNumber:1,
    content:"첫번째 문항 1번 선택지입니다.",
    point:1
    
  }){
    id
    choiceNumber
    content
    point
  }
}
```

### 결과
```graphql
{
  "data": {
    "createChoice": {
      "id": 4,
      "choiceNumber": 1,
      "content": "첫번째 문항 1번 선택지입니다.",
      "point": 1
    }
  }
}
```


</details>

<details><summary>
선택지 단일 조회
</summary>

* 선택지의 Id 값을 입력하여 특정 선택지를 조회합니다.
* 선택지가 포함된 문항에 대한 데이터를 함께 조회 할 수 있습니다.
* 해당 선택지의 유무를 확인합니다.

Error Message
```
'해당 보기가 없습니다.'
```

### 쿼리
```graphql
query{
  choice(id:1){
    id
    parentsQuestion{
      id
    }
    choiceNumber
    content
    point
  }
}
```

### 결과
```graphql
{
  "data": {
    "choice": {
      "id": 1,
      "parentsQuestion": {
        "id": 1
      },
      "choiceNumber": 1,
      "content": "첫번째 문항 1번 선택지 입니다.",
      "point": 1
    }
  }
}
```
</details>

<details><summary>
문항에 포함된 선택지 조회
</summary>

* 문항 ID를 입력하면, 해당 문항에 포함된 모든 선택지를 조회할 수 있습니다.

### 쿼리
```graphql
query{
  findChoiceIncludQuestion(parentsQuestionId:1){
    id
    choiceNumber
    content
    point
  }
}
```

### 결과
```graphql
{
  "data": {
    "findChoiceIncludQuestion": [
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
      },
      {
        "id": 4,
        "choiceNumber": 4,
        "content": "첫번째 문항 4번 선택지입니다.",
        "point": 4
      }
    ]
  }
}
```


</details>

<details><summary>
선택지 수정
</summary>

* 선택지의 ID를 입력한 후, 선택지 번호 (questionNumber), 선택지 내용(content),선택지 점수(point)를 입력하여 해당 설문지의 데이터를 수정할 수 있습니다.
* 선택지 수정시, 해당 문항 내에 본인을 제외한 동일한 선택지 번호와 내용,점수의 유무를 중복 검사하여 확인합니다.
* 해당 선택지의 유무를 확인합니다.

Error Message
```
유무 확인
'해당 ID:${id} 를 가진 문제가 없습니다.'

중복확인
'문제에 동일한 보기번호가 존재합니다,보기번호를 변경하세요'
'문제에 동일한 점수의 번호가 존재합니다,점수를 변경하세요'
'문제에 동일한 보기내용이 존재합니다,보기내용을변경하세요'
```

### 쿼리
```graphql
  mutation{
  updateChoice(updateChoiceInput:{
    id:3,
    choiceNumber:5,
    content:"첫번째 문항 5번 선택지 입니다.",
    point:5
  }){
    id
    content
    point
  }
}
```

### 결과
```graphql
{
  "data": {
    "updateChoice": {
      "id": 3,
      "content": "첫번째 문항 5번 선택지 입니다.",
      "point": 5
    }
  }
}
```
</details>

<details><summary>
선택지 삭제
</summary>

* 선택지의 Id 값을 입력하여 특정 선택지을 삭제합니다.
* 삭제에 성공 하면 **true** 값을 반환하고 실패하면 **false** 값을 반환 합니다.

### 쿼리
```graphql
  mutation{
  removeChoice(id:1)
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

####  - 답변 CRUD

<details><summary>
답변 생성 및 설문지 완료
</summary>
* 답변은  "기본 설문지"의 모든 문항에 대한 답변을 한 번에 수집하여 데이터를 처리합니다.

1. 사용자가 "기본 설문지"의 ID(OriginalSurveyId), 각 문항의 ID(questionId), 그리고 선택한 선택지의 ID(selectChoiceId)를 userAnswer 배열에 입력하여 응답을 전송하면, 시스템은 먼저 이 정보를 바탕으로 새로운 "사용자 응답 설문지(user survey)"를 생성합니다.
2. 그 다음, 선택한 각 선택지의 ID에 해당하는 점수(point)를 찾습니다.
3. 마지막으로, 시스템은 각 문항의 ID, 선택한 선택지의 ID, 해당 선택지의 점수, 그리고 생성된 응답 설문지의 고유 ID를 저장합니다.
4. 데이터가 저장이 되면 설문지가 완료 됩니다.

* 답변이 입력되면 같은 문항에 중복된 답변이 있는지 확인합니다.
* 답변이 입력되면 해당 기본설문지의 전체 문항 수와 제출된 답변의 수를 비교합니다.

Error Message
```
같은 문항에 중복된 답변 확인 
"같은 질문에 중복된 답변이 존재합니다."

전체 문항 수와 제출된 답변의 수 비교 
"입력된 답변이 없습니다."
"${emptyAnswersQuestionNumber}번 문제의 답변이 없습니다."
"문제의 수를 확인해 주세요.문제보다 많은 수의 답변이 입력되었습니다."
```


### 쿼리
```graphql
mutation{
  createUserAnswer(createUserAnswerInput:{
    OriginalSurveyId:1
    userAnswer:[
      {
        questionId:1
        selectChoiceId:1
      },
        {
        questionId:2
        selectChoiceId:5
      },{
        questionId:3
        selectChoiceId:6
      }
    ]
  })
    {
      id
      questionId
      selectChoiceId
      point
      parentsUserSurvey{
        id
      }
      
    },
}
```

### 결과
```graphql
{
  "data": {
    "createUserAnswer": [
      {
        "id": 1,
        "questionId": 1,
        "selectChoiceId": 1,
        "point": 1,
        "parentsUserSurvey": {
          "id": 1
        }
      },
      {
        "id": 2,
        "questionId": 2,
        "selectChoiceId": 5,
        "point": 1,
        "parentsUserSurvey": {
          "id": 1
        }
      },
      {
        "id": 3,
        "questionId": 3,
        "selectChoiceId": 6,
        "point": 1,
        "parentsUserSurvey": {
          "id": 1
        }
      }
    ]
  }
}
```


</details>

<details><summary>
답변 단일 조회
</summary>

* 사용자 답변의 Id 값을 입력하여 특정 사용자 답변을 조회합니다.
* 사용자 답변의 부모 사용자 응답 설문지 와 기본 설문지에 대한 데이터를 함께 조회 할 수 있습니다.
* 해당 사용자 답변의 유무를 확인합니다.

Error Message
```
"저장된 사용자 답변이 없습니다."
```



### 쿼리
```graphql
query{
  userAnswer(id:1){
    id
    questionId
    selectChoiceId
    parentsUserSurvey{
      id
      originalSurvey{
        id
        title
        description
        footer
      }
    }
  }
}
```

### 결과
```graphql
{
  "data": {
    "userAnswer": {
      "id": 1,
      "questionId": 1,
      "selectChoiceId": 1,
      "parentsUserSurvey": {
        "id": 1,
        "originalSurvey": {
          "id": 1,
          "title": "마음연구소",
          "description": "마음연구소",
          "footer": "끝."
        }
      }
    }
  }
}
```


</details>

<details><summary>
사용자 응답 설문지에 포함된 사용자 답변 조회
</summary>

* 사용자 응답 설문지 ID(userSurveyId)를 입력하면, 해당 사용자 응답 설문지에 포함된 모든 사용자 답변을 조회할 수 있습니다.
* 사용자 응답 설문지의 유무를 확인합니다.

Error Message
```
"저장된 사용자 응답 설문지가 없습니다."
```




### 쿼리
```graphql
query{
  findAnswersIncludUserSurvey(userSurveyId:1){
    id
    questionId
    selectChoiceId
    parentsUserSurvey{
      id
    }
  }
}```

### 결과
```graphql
{
  "data": {
    "findAnswersIncludUserSurvey": [
      {
        "id": 1,
        "questionId": 1,
        "selectChoiceId": 1,
        "parentsUserSurvey": {
          "id": 1
        }
      },
      {
        "id": 2,
        "questionId": 2,
        "selectChoiceId": 5,
        "parentsUserSurvey": {
          "id": 1
        }
      },
      {
        "id": 3,
        "questionId": 3,
        "selectChoiceId": 6,
        "parentsUserSurvey": {
          "id": 1
        }
      }
    ]
  }
}
```
</details>

<details><summary>
답변 수정
</summary>

* 답변의 ID를 입력한 후, 선택한 선택지 ID(selectChoiceId) 를 입력하여 해당 답변의 데이터를 수정할 수 있습니다.
* 시스템은 제공된 선택지 ID에 해당하는 점수(point)를 찾아 해당 답변의 점수 데이터를 수정합니다.
* 해당 답변의 유무 와 선택한 선택지의 유무를 확인합니다.

Error Message
```
답변의 유무 확인 
'저장된 사용자 답변이 없습니다.'

선택한 선택지의 유무 확인
'해당 보기가 없습니다.'
```


### 쿼리
```graphql
mutation{
  updateUserAnswer(updateUserAnswerInput:{
    id:1
    selectChoiceId:2
  }){
    id
    questionId
    selectChoiceId
    point
  }
}
```

### 결과
```graphql
{
  "data": {
    "updateUserAnswer": {
      "id": 1,
      "questionId": 1,
      "selectChoiceId": 2,
      "point": 2
    }
  }
}
```
</details>

<details><summary>
답변 삭제
</summary>

* 답변의 Id 값을 입력하여 특정 답변을 삭제합니다.
* 삭제에 성공 하면 true 값을 반환하고 실패하면 false 값을 반환 합니다.

### 쿼리
```graphql
mutation{
  removeUserAnswer(id:6)
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


####  - 완료된 설문지 확인

<details><summary>
완료된 설문지 확인
</summary>

* 응답 설문지의 ID 값을 입력하여 완료된 응답 설문지를 조회합니다.
1. 반환되는 정보에는 사용자가 응답한 "**기본 설문지**"의 기본 정보(제목, 설명 등), 설문지에 포함된 각 "**문항**", 문항별 "**선택지**", 그리고 사용자의 "**답변**"이 포함됩니다. 이 정보는 사용자의 답변과 각 문항의 선택지 정보를 통합하여 제공됩니다.
2. 사용자의 모든 답변에 대한 총 점수(totalScore)가 계산되어 표시됩니다.
3. 각 문항에서 사용자가 선택한 선택지의 ID(selectChoiceId)가 제공되어, 사용자가 어떤 선택을 했는지 확인할 수 있습니다.

### 쿼리
```graphql
query{
  userSurvey(id:1){
    id
    originalSurveyId
    title
    description
    footer
    totalScore
    question{
      id
      questionNumber
      content
      selectChoiceId
      choice{
        id
        choiceNumber
        point
      }
    }
  }
}
```

### 결과
```graphql
{
  "data": {
    "userSurvey": {
      "id": 1,
      "originalSurveyId": 1,
      "title": "마음연구소 설문지",
      "description": "마음연구소 설문지 입니다.",
      "footer": "마음연구소 설문지 였습니다.",
      "totalScore": 4,
      "question": [
        {
          "id": 1,
          "questionNumber": 1,
          "content": "1번 문항",
          "selectChoiceId": 2,
          "choice": [
            {
              "id": 1,
              "choiceNumber": 1,
              "point": 1
            },
            {
              "id": 2,
              "choiceNumber": 2,
              "point": 2
            },
            {
              "id": 4,
              "choiceNumber": 4,
              "point": 4
            },
            {
              "id": 3,
              "choiceNumber": 5,
              "point": 5
            }
          ]
        },
        {
          "id": 2,
          "questionNumber": 2,
          "content": "두번째 문항 입니다.",
          "selectChoiceId": 5,
          "choice": [
            {
              "id": 5,
              "choiceNumber": 1,
              "point": 1
            },{
              "id": 7,
              "choiceNumber": 2,
              "point": 2
            }
          ]
        },
        {
          "id": 3,
          "questionNumber": 3,
          "content": "세번째 문항 입니다.",
          "selectChoiceId": 6,
          "choice": [
            {
              "id": 6,
              "choiceNumber": 1,
              "point": 1
            }, {
              "id": 8,
              "choiceNumber": 2,
              "point": 2
            }
          ]
        }
      ]
    }
  }
}
```


</details>
