// Destination 선택 화면에서 사용하는 타입 (현재는 mock data 전용)

export interface City {
  id: string;
  name: string;
  isAll?: boolean; // "All South Korea" 같은 국가 전체 항목
}

export interface Country {
  id: string;
  name: string;
  cities: City[];
}

export interface Destination {
  country: Country;
  city: City;
}
