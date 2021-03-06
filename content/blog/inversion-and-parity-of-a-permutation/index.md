---
title: Inversion과 순열의 기우성
date: 2022-02-28
tags:
  - algorithm
  - mathematics
published: true
---

최근 코드포스가 뜸해서 앳코더를 시작했다. [ARC 136 B](https://atcoder.jp/contests/arc136/tasks/arc136_b)를 풀었다.

수열의 연속된 세 개의 값 $a_i, a_{i+1}, a_{i+2}$를 $a_{i+2}, a_i, a_{i+1}$로 바꾸는 shift 연산을 써서 수열 $A$를 $B$로 만들 수 있는지 묻는 문제다.

$O(N^2)$ 시뮬레이션으로 풀었는데, 에디토리얼을 보니 $O(N\log{N})$까지 가능하다.

애드혹인 줄 알았지만 수학에서 유명한 토픽이란다. 또 나만 모르는 웰노운인가 싶어 정리한다.

우선 호환(transposition)을 생각하자. 순열의 어떤 인덱스 $i$, $j$의 값을 swap하는 연산이다. 이때 inversion number(count)는 홀짝이 바뀐다.

왜 그런지 살펴보자. 일단 $(i, j)$는 inversion이 뒤바뀔 것이다. $i$보다 작거나 $j$보다 큰 인덱스는 영향을 받지 않는다. 그리고 $i<k<j$인 인덱스 $k$는 $(i, k)$와 $(k, j)$가 짝을 이루므로 짝수 개 만큼의 inversion이 변화한다.[^1] 따라서 호환은 항상 inversion number의 홀짝을 바꾼다.

[^1]:[순열의 홀짝성 - 카탄 블로그](https://blog.naver.com/hunterblack/221313159075)

위 문제의 shift 연산은 $a_{i+1}$과 $a_{i+2}$를 swap, $a_{i+2}$와 $a_i$를 swap하는 2개의 호환으로 표현할 수 있다. 때문에 같은 값이 없다면 shift 연산을 해도 inversion number의 기우성은 불변한다.

 A와 B의 inversion number를 세는 문제로 바뀌므로 펜윅 트리 등을 사용하면 쉽게 해결할 수 있다. 같은 수가 있다면 shift 연산이 홀짝을 바꿀 수 있어 항상 가능함을 주의해야 한다.

![well-known](./well-known.png)

거의 동일한 문제인 [백준 5000 빵 정렬](https://www.acmicpc.net/problem/5000)은 $O(N)$에 풀이할 수도 있다. 좀 더 나아가보자.

Inversion number의 기우성은 곧 순열의 기우성임을 이용한다. 이게 무슨 소리일까?

어떤 순열을 trivial한 순열(1, 2, 3...)로부터 호환을 통해 만든다고 하자. 이때 어떠한 순서로 swap하든 전체 호환 개수의 기우성이 변하지 않는다는 걸 알 수 있다. 즉 순열이 결정되면 이러한 기우성도 결정된다. 이걸 순열의 기우성이라 한다.

순열의 값 $a_x$에 대해 $f(x)=a_x$를 정의하면 $f(x)$의 합성이 사이클을 가진다는 건 잘 알려진 사실이다. 잘 생각해보면 모든 사이클은 호환으로 표현할 수 있는 걸 알 수 있다. 순열 1, 2, 3...은 모든 사이클의 길이가 1인 것을 상기하자.

그러므로 어떤 순열은 사이클로 분해할 수 있고 더 잘게 호환으로 분해할 수도 있다. 그런데 순열을 구성하는 총 호환 개수의 기우성은 결정돼 있다. 이때 주기가 $k$인 사이클을 구성하는 호환의 최소 개수는 $k-1$이므로, 짝수 길이 사이클 개수의 홀짝이 곧 순열의 홀짝이다. 이건 $O(N)$으로 간단하게 구할 수 있다.

요약하면 다음과 같다:

순열의 기우성은 transposition 분해의 길이의 기우성이자 inversion number의 기우성이다.
