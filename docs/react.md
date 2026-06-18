# React

## 基础用法

```tsx
import { useEffect, useRef } from 'react';
import { LivePhotoViewer } from 'live-photo';

export default function Demo() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewer = new LivePhotoViewer({
      photoSrc: 'https://lpalette.oss-accelerate.aliyuncs.com/go_oss/prod/mkIo6X4FryYKOcUzuz4Kew/2026-06-15/3c14973c-bfbb-4d8b-9296-d3be902e3171.jpeg',
      videoSrc: 'https://lpalette.oss-accelerate.aliyuncs.com/go_oss/prod/mkIo6X4FryYKOcUzuz4Kew/videos/trans/979bc89e-16c1-4a3a-b8c4-daa4837d575c/720p.mp4',
      container: ref.current!,
      autoplay: true,
      height: 320,
      borderRadius: 12,
      theme: 'auto',
      onEnded: () => console.log('播放结束'),
      onError: (error) => console.error(error.message),
    });
    return () => viewer.destroy();
  }, []);

  return <div ref={ref} style={{ width: 400, height: 400 }} />;
}
```

## 封装为可复用组件

```tsx
// LivePhoto.tsx
import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { LivePhotoViewer } from 'live-photo';
import type { LivePhotoOptions, LivePhotoAPI } from 'live-photo';

type Props = Omit<LivePhotoOptions, 'container'> & {
  width?: number | string;
  height?: number | string;
};

const LivePhoto = forwardRef<LivePhotoAPI, Props>(
  ({ width = 300, height = 300, ...options }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<LivePhotoViewer | null>(null);

    useEffect(() => {
      viewerRef.current = new LivePhotoViewer({
        ...options,
        container: containerRef.current!,
      });
      return () => viewerRef.current?.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options.photoSrc, options.videoSrc]);

    useImperativeHandle(ref, () => ({
      play: () => viewerRef.current!.play(),
      pause: () => viewerRef.current!.pause(),
      stop: () => viewerRef.current!.stop(),
      toggle: () => viewerRef.current!.toggle(),
      setMuted: (v: boolean) => viewerRef.current!.setMuted(v),
      toggleMute: () => viewerRef.current!.toggleMute(),
      getState: () => viewerRef.current!.getState(),
      destroy: () => viewerRef.current!.destroy(),
    }));

    return <div ref={containerRef} style={{ width, height }} />;
  }
);

export default LivePhoto;
```

```tsx
// 使用封装组件
import { useRef } from 'react';
import LivePhoto from './LivePhoto';
import type { LivePhotoAPI } from 'live-photo';

export default function App() {
  const ref = useRef<LivePhotoAPI>(null);

  return (
    <div>
      <LivePhoto
        ref={ref}
        photoSrc="https://lpalette.oss-accelerate.aliyuncs.com/go_oss/prod/mkIo6X4FryYKOcUzuz4Kew/2026-06-15/3c14973c-bfbb-4d8b-9296-d3be902e3171.jpeg"
        videoSrc="https://lpalette.oss-accelerate.aliyuncs.com/go_oss/prod/mkIo6X4FryYKOcUzuz4Kew/videos/trans/979bc89e-16c1-4a3a-b8c4-daa4837d575c/720p.mp4"
        width={400}
        height={400}
        autoplay
        borderRadius={12}
        onEnded={() => console.log('播放结束')}
      />
      <button onClick={() => ref.current?.toggle()}>切换播放</button>
    </div>
  );
}
```

## 动态切换媒体源

```tsx
import { useEffect, useRef, useState } from 'react';
import { LivePhotoViewer } from 'live-photo';

const sources = [
  { photoSrc: 'photo1.jpg', videoSrc: 'video1.mp4' },
  { photoSrc: 'photo2.jpg', videoSrc: 'video2.mp4' },
];

export default function Gallery() {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const viewer = new LivePhotoViewer({
      ...sources[index],
      container: ref.current!,
      autoplay: true,
    });
    return () => viewer.destroy();
  }, [index]);

  return (
    <div>
      <div ref={ref} style={{ width: 400, height: 400 }} />
      <button onClick={() => setIndex(i => (i + 1) % sources.length)}>
        下一张
      </button>
    </div>
  );
}
```
