# 지도 데이터 출처 · 라이선스

## 사용 데이터 (SVG 생성에 사용)

| 항목 | 내용 |
|---|---|
| 데이터 | 대한민국 행정동 경계 `HangJeongDong_ver20260701.geojson` |
| 기준일 | 2026-07-01 |
| 원자료 | 통계청 통계지리정보서비스(SGIS) 행정동 경계 — https://sgis.kostat.go.kr |
| 가공 | vuski/admdongkor — https://github.com/vuski/admdongkor |
| 라이선스 | 원자료 공공누리 제1유형(출처표시) / 가공물 CC BY 4.0 (상업적 이용 가능, 출처표시 필수) |
| 좌표계 | WGS84 (EPSG:4326) |
| 다운로드 | https://raw.githubusercontent.com/vuski/admdongkor/master/ver20260701/HangJeongDong_ver20260701.geojson |
| 보관 위치 | `source/admdongkor-ver20260701/` (라이선스 전문 `LICENSE-DATA.txt` 포함) |

### 필수 출처 표기 (앱/웹에 지도를 게시할 때)

> 본 지도는 통계청 통계지리정보서비스(SGIS)에서 공공누리 제1유형으로 개방한 행정동 경계를 가공한 것입니다(가공: vuski/admdongkor, CC BY 4.0).

## 검토했지만 사용하지 않은 데이터

`source/geoboundaries-reviewed/` — geoBoundaries gbOpen KOR (요청된 1차 출처)

| | ADM1 (시·도) | ADM2 (시·군·구) |
|---|---|---|
| 원자료 | Natural Earth | citypopulation.de |
| 기준 연도 | 2021 | 2020 |
| 라이선스 | Public Domain | CC BY 3.0 |

사용하지 않은 이유
- 독도가 두 데이터 모두에 없음
- 2023-07 군위군 대구 편입, 2023-06 강원특별자치도, 2024-01 전북특별자치도, 2026-07 전남광주통합특별시 미반영
- ADM1과 ADM2의 출처가 달라 해안선·경계가 서로 맞지 않음

## 현재 행정구역 반영 사항 (2026-07-01 기준)

- 시·도 16개: 광주광역시 + 전라남도 → **전남광주통합특별시** (2026-07-01 출범)
- 강원특별자치도(2023), 전북특별자치도(2024) 명칭 반영
- 대구광역시에 군위군 포함 (2023-07)
- 경기도: 화성시 4개 일반구(2026), 부천시 3개 일반구(2024) 신설 → 지도에서는 시 단위로 병합

## 가공 방법 (`source/build_maps.py`, Python 표준 라이브러리만 사용)

1. 행정동을 시·도(`sido` 코드) / 경기도 시·군(`sgg` 앞 4자리, 일반구 병합) 단위로 묶음
2. 인접 폴리곤의 공유 경계를 제거해 병합 (원본 좌표 그대로)
3. Mercator 투영 후 폭 390px viewBox로 변환
4. 인접 지역 경계가 어긋나지 않도록 경계선 단위(arc)로 Douglas-Peucker 단순화
5. 면적 0.1~0.15px² 미만의 아주 작은 섬은 생략 (단, 경상북도는 독도 유지를 위해 생략하지 않음)

재생성: `python design/maps/source/build_maps.py design/maps/source/admdongkor-ver20260701/HangJeongDong_ver20260701.geojson design/maps`
