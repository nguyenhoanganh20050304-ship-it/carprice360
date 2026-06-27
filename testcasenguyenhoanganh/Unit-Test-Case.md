| # | Lớp/Hàm | Input | Expected Output |
| --- | --- | --- | --- |
| 1 | ``SolveEquation.linearEquation`` | (0,0) | ``"Multi ``roots"`` |
|  |  | (0,10) | ``"No ``root"`` |
|  |  | (3,7) | ``"One ``root"`` |
| 2 | ``MaxNumber1.max3`` | (15,12,9) | ``15`` |
|  |  | (5,10,3) | ``10`` |
|  |  | (5,3,10) | ``10`` |
|  |  | (10,10,5) | ``10`` |
|  |  | (5,10,10) | ``10`` |
|  |  | (10,5,10) | ``10`` |
|  |  | (7,7,7) | ``7`` |
| 3 | ``MaxNumber2.max2`` | (10,5) | ``10`` |
|  |  | (5,10) | ``10`` |
|  |  | (7,7) | ``7`` |
| 4 | ``Sort1.sortAsc`` | (10,3) | (3,10) |
|  |  | (2,5) | (2,5) |
| 5 | ``Sort2.sortDesc`` | (10,3) | (10,3) |
|  |  | (3,10) | (10,3) |
| 6 | ``Triangle.maxLength`` | (9,4,1) | ``9`` |
|  |  | (3,9,5) | ``9`` |
|  |  | (2,4,8) | ``8`` |
| 7 | ``Advance1.USCLN`` | (12,8) | ``4`` |
|  | ``Advance1.BSCNN`` | (4,6) | ``12`` |
|  | ``Advance1.USCLN`` | (0,4) | Exception |
|  | ``Advance1.BSCNN`` | (4,0) | Exception |
|  | ``Advance1.USCLN`` | (-4,8) | Exception |
| 8 | ``Advance2.sum`` | 5765 | ``23`` |
|  |  | -123 | ``-6`` |
|  |  | 0 | ``0`` |
| 9 | ``Advance3.fibonacci`` | 5 | ``5`` |
|  |  | -3 | ``-1`` |
|  |  | 0 | ``0`` |
| 10 | ``Advance4.isPrimeNumber`` | 7 | ``true`` |
|  |  | 6 | ``false`` |
|  |  | -3 | ``false`` |
| 11 | ``Advance5.kiemTraDoiXung`` | 12121 | ``true`` |
|  |  | 0 | ``true`` |
|  |  | -102 | ``false`` |
|  |  | -101 | ``false`` |
| 12 | ``Advance6.tinhTuoi`` | (12,1,1999) | ``27`` |
|  |  | (12,1,2030) | Exception hoặc ``-1`` |
|  |  | (-12,1,2000) | Exception |
|  |  | (12,-1,2000) | Exception |
|  |  | (12,1,-2030) | Exception |
| 13 | ``Advance7.tinhThu`` | (6,4,2020) | ``2`` |
|  |  | (35,6,2019) | 1–7 (Calendar tự cuộn) |
|  |  | (19,35,2020) | Exception |
|  |  | (-19,9,2020) | 1–7 |
|  |  | (19,-9,2020) | Exception |
|  |  | (19,9,-2020) | 1–7 |
| 14 | ``ArraySum.calculateSum`` | {2,4,6,8} | ``20`` |
|  |  | {-1,0,1} | ``0`` |
|  |  | {10,20,30,40,50} | ``150`` |
| 15 | ``StringReversal.reverseString`` | "hello" | ``"olleh"`` |
|  |  | "world" | ``"dlrow"`` |
|  |  | "" | ``""`` |
|  |  | "a" | ``"a"`` |
|  |  | "hello world" | ``"dlrow ``olleh"`` |
| 16 | ``LoginService.login`` | ("user","password") | ``true`` |
|  |  | ("invalidUser","password") | ``false`` |
|  |  | ("user","wrongPassword") | ``false`` |
|  |  | ("guest","123456") | ``false`` |
|  |  | ("","") | ``false`` |
|  |  | ("","password") | ``false`` |
|  |  | ("user","") | ``false`` |
|  |  | (" user "," password ") | ``false`` |