# Future Concept
1. In Text element area: while typing the software suggest next word
2. AI - give drawing prompt and that ai will draw that drawing.




client/
│
├── public/
│
├── src/
│
│  ├── app/
│  │   ├── App.tsx
│  │   ├── providers.tsx
│  │   └── router.tsx
│
│  ├── api/
│  │   ├── client.ts
│  │   ├── auth.ts
│  │   ├── boards.ts
│  │   └── ws.ts
│
│  ├── features/
│  │
│  │   └── whiteboard/
│  │
│  │        ├── components/
│  │        │
│  │        │   ├── canvas/
│  │        │   │   └── CanvasBoard.tsx
│  │        │   │
│  │        │   ├── overlays/
│  │        │   │   ├── SelectionBox.tsx
│  │        │   │   └── PresenceCursor.tsx
│  │        │   │
│  │        │   ├── toolbar/
│  │        │   │   └── Toolbar.tsx
│  │        │   │
│  │        │   └── WhiteboardPage.tsx
│  │
│  │        ├── engine/
│  │        │
│  │        │   ├── drawingEngine.ts
│  │        │   ├── renderer.ts
│  │        │   ├── smoothing.ts
│  │        │
│  │        │   ├── geometry/
│  │        │   │   ├── hitTest.ts
│  │        │   │   ├── transform.ts
│  │        │   │   └── bounds.ts
│  │        │
│  │        │   └── operations/
│  │        │       ├── applyOperation.ts
│  │        │       ├── serializeOperation.ts
│  │        │       └── replayOperations.ts
│  │
│  │        ├── hooks/
│  │        │   ├── useCanvas.ts
│  │        │   ├── usePointerDraw.ts
│  │        │   └── useKeyboardShortcuts.ts
│  │
│  │        ├── models/
│  │        │   ├── element.ts
│  │        │   ├── stroke.ts
│  │        │   └── board.ts
│  │
│  │        ├── store/
│  │        │   ├── boardStore.ts
│  │        │   ├── historyStore.ts
│  │        │   ├── toolStore.ts
│  │        │   └── viewportStore.ts
│  │
│  │        ├── tools/
│  │        │   ├── penTool.ts
│  │        │   ├── eraserTool.ts
│  │        │   └── selectTool.ts
│  │
│  │        ├── utils/
│  │        │   ├── geometry.ts
│  │        │   └── snapshotStorage.ts
│  │
│  │        └── types/
│  │            └── whiteboardTypes.ts
│  │
│  ├── hooks/
│  │   ├── useAuth.ts
│  │   ├── useWebSocket.ts
│  │   └── useMobile.ts
│  │
│  ├── lib/
│  │   ├── clipboard.ts
│  │   ├── utils.ts
│  │   └── logger.ts
│  │
│  ├── pages/
│  │   ├── Index.tsx
│  │   ├── Login.tsx
│  │   ├── Signup.tsx
│  │   └── NotFound.tsx
│  │
│  ├── types/
│  │   ├── auth.ts
│  │   └── protocol.ts
│  │
│  ├── styles/
│  │   ├── globals.css
│  │   └── tailwind.css
│  │
│  ├── main.tsx
│  └── vite-env.d.ts
│
├── tests/
│
└── package.json













features/whiteboard

components/
  canvas/
    WhiteboardCanvas.tsx

  overlays/
    SelectionBox.tsx
    PresenceCursor.tsx

  toolbar/
    Toolbar.tsx

pages/
  WhiteboardPage.tsx

engine/
  drawingEngine.ts
  renderer.ts
  smoothing.ts

  geometry/
    hitTest.ts
    transform.ts
    bounds.ts
    geometry.ts

  operations/
    applyOperation.ts
    serializeOperation.ts
    replayOperations.ts

hooks/
  useCanvas.ts
  usePointerDraw.ts
  useKeyboardShortcuts.ts

models/
  element.ts
  stroke.ts
  boardModel.ts

store/
  boardStore.ts
  historyStore.ts
  toolStore.ts
  viewportStore.ts

tools/
  penTool.ts
  eraserTool.ts
  selectTool.ts

utils/
  snapshotStorage.ts

types/
  whiteboardTypes.ts