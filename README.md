# Nest_JS_Codefactory_Part1
코드팩토리 Nest JS 백엔드 앱 Part1 강의 코드 저장소

<hr>

# Dependency Injection / Inversion of Control
<h3>의존성 주입과 제어의 역전 (서비스에 대한 권한과 접급이 가능했던 이유)</h5>
<hr>


## Dependency Injection란?
<hr>

일반 인스턴스화
```javascript
class A {
  const b = B();
}

class B {
  
}
```
<br>

Dependency Injection의 예시
```javascript
class A {
  constructor(instance: B);
}

class B {
  
}
```
<br>

예시를 살펴보면 어디선가 `class B`를 생성해서 constructor에다가 입력을 해줍니다. 

이것을 `Injection`. 즉, `주입`이라고 합니다. 

(`class A`를 생성할때는 항상 `class B`에 해당되는 인스턴스를 넣어주도록 정의)


<br>

### 그럼 dependency란?

현재 Dependency Injection에 예시 코드를 보면 class A을 사용할때 class A는 class B의 인스턴스가 필요하기 때문에 `class A는 class B의 의존`하고 있습니다.

<br>

즉, Dependency Injection이란 `의존하고 있는 값을 주입해준다` 라고 생각하시면 됩니다.

예시에서 class A는 class B의 인스턴스를 무조건 주입해주어야하기 때문에 class A는 class B의 의존성을 갖고 있고 class B의 인스턴스가 class A가 생성될때 주입된다. 

그렇기 때문에 Dependency Injection이다 라고 이해하시면 됩니다.


<br>
<br>

## Inversion of Control (제어의 역전)
<hr>


```javascript
class B {
  
}

class A {
  constructor(instance: B);
}

class C {
  constructor(instance: B);
}
```
<br>

위에 코드에서 class B는 class A와 class C의 constructor에 어디선가 생성되서 주입이 될겁니다.

각 주입되고 있는 class B가 선언되고 인스턴스가 생성되고 주입, 마지막엔 삭제되는 과정까지를 프레임워크가 담당을 합니다.

(프로그래머가 제어하지 않고 외부에 프로그램이 관리하는 것)












<br>
<br>
<br>
<br>
<br>
<br>
<br>




