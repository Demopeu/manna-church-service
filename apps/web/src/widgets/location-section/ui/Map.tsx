'use client';

import {
  Container as MapDiv,
  Marker,
  NaverMap,
  NavermapsProvider,
  useNavermaps,
} from 'react-naver-maps';

function MapContent() {
  const navermaps = useNavermaps();

  // 만나교회 좌표
  const position = { lat: 35.06374, lng: 128.981336 };

  return (
    <NaverMap
      defaultCenter={new navermaps.LatLng(position.lat, position.lng)}
      defaultZoom={17}
      zoomControl={true}
      zoomControlOptions={{
        position: navermaps.Position.TOP_RIGHT,
      }}
    >
      <Marker
        position={new navermaps.LatLng(position.lat, position.lng)}
        animation={navermaps.Animation.BOUNCE}
        onClick={() => {
          window.open(
            `https://map.naver.com/v5/search/부산 사하구 다대로429번길 23`,
          );
        }}
      />
    </NaverMap>
  );
}

export function LocationMap() {
  return (
    <NavermapsProvider ncpKeyId={process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID!}>
      <div className="border-border/50 relative h-[400px] w-full overflow-hidden rounded-2xl border shadow-md">
        <MapDiv
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <MapContent />
        </MapDiv>
      </div>
    </NavermapsProvider>
  );
}
