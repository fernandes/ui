# Drawer - Plano de Correção Completo

## Análise: Por que não funciona como Vaul

### Problemas Fundamentais

#### 1. **Confusão entre "Posição Durante Drag" vs "Posição Final"**

**Vaul (correto)**:
- Durante drag: Transform é apenas o delta do ponteiro
- Ao soltar: Calcula qual snap point e anima até lá
- Snap points só afetam a posição FINAL, não o drag

**Nossa implementação (errado)**:
- Durante drag: Tentamos aplicar offsets de snap points
- Misturamos `dragStartOffset + delta`
- Isso causa jumps e deltas enormes

#### 2. **Transform Calculation Inconsistente**

**Vaul**:
```javascript
// Durante drag - delta direto do ponteiro
set(drawerRef, draggedDistance)

// Função set() simplesmente faz:
element.style.transform = `translate3d(0, ${distance}px, 0)`
```

**Nossa implementação**:
- Usamos `getTransformForDirection(delta)` em alguns lugares
- Usamos `getTransformForSnapPoint(offset)` em outros
- Não há clareza sobre quando usar qual

#### 3. **Snap Point Logic Completamente Errada**

**Como Vaul funciona**:
1. Drawer SEMPRE começa no primeiro snap point (não totalmente aberto!)
2. Durante drag, posição = delta do ponteiro (sem considerar snap point)
3. Ao soltar:
   - Calcula qual o snap point mais próximo da posição atual
   - Anima suavemente até aquele snap point

**Nossa implementação**:
- Drawer abre totalmente (ignora snap points)
- Tentamos calcular offsets durante drag
- Lógica de "closest snap point" está usando offsets ao invés de pixels

## Como Vaul Realmente Funciona

### 1. **Inicialização**

```javascript
// Drawer sempre começa no primeiro snap point
useEffect(() => {
  if (open) {
    const firstSnapPoint = snapPoints[0]
    const firstOffset = getSnapPointOffset(firstSnapPoint)
    set(drawerRef, -firstOffset) // Posiciona no primeiro snap point
  }
}, [open])
```

**Tradução para Rails**:
- Quando `open: true`, drawer deve ir para `snapPoints[0]`
- Se `snapPoints = [0.5, 1]`, abre em 50%, NÃO em 100%

### 2. **Durante o Drag**

```javascript
function handleDrag(event) {
  const dragDistance = startY - event.clientY // Delta simples do ponteiro
  set(drawerRef, dragDistance) // Aplica direto

  // Sem cálculos de snap points aqui!
  // Sem offsets!
  // Apenas delta puro!
}
```

**Tradução**:
```javascript
updateTransform(delta) {
  // SIMPLES: apenas aplica o delta
  const transform = `translate3d(0, ${delta}px, 0)`
  this.contentTarget.style.transform = transform
}
```

### 3. **Ao Soltar (Release)**

```javascript
function onRelease() {
  const currentPosition = getCurrentY() // Posição atual do drawer

  // Encontra snap point mais próximo BASEADO NA POSIÇÃO ATUAL
  const closestSnap = findClosestSnapPoint(currentPosition)

  // Anima até o snap point
  animateToSnapPoint(closestSnap)
}

function findClosestSnapPoint(currentY) {
  let closest = snapPoints[0]
  let minDistance = Infinity

  snapPoints.forEach(snap => {
    const snapY = getSnapPointY(snap) // Converte snap para Y
    const distance = Math.abs(currentY - snapY)

    if (distance < minDistance) {
      minDistance = distance
      closest = snap
    }
  })

  return closest
}
```

**Nosso erro**: Estamos calculando "closest" baseado em offsets, não em posição Y real.

## Solução: Refatoração Completa

### Passo 1: Simplificar Transform durante Drag

**Remover**:
- `dragStartOffset`
- `effectiveDelta = dragStartOffset + delta`
- Uso de `getTransformForSnapPoint` durante drag

**Implementar**:
```javascript
updateTransform(delta) {
  if (!this.hasContentTarget) return

  // SIMPLES: apenas aplica delta
  this.contentTarget.style.transform = `translate3d(0, ${delta}px, 0)`

  // Overlay opacity baseado em delta
  this.updateOverlayOpacity(delta)
}
```

### Passo 2: Corrigir Snap Point Positioning

**Problema atual**: Snap points abrem totalmente

**Solução**:
```javascript
show() {
  // ... set data-state open ...

  // Se tem snap points, posiciona no PRIMEIRO snap point
  if (this.snapPointsValue.length > 0) {
    const firstSnapY = this.getSnapPointY(0)
    this.contentTarget.style.transform = `translate3d(0, ${firstSnapY}px, 0)`
    this.activeSnapPointValue = 0
  }
}

// Nova função: converte snap point index para Y position
getSnapPointY(snapIndex) {
  const snapPoint = this.snapPointsValue[snapIndex]
  const containerHeight = this.getDrawerSize()

  let pixels
  if (typeof snapPoint === 'string' && snapPoint.includes('px')) {
    pixels = parseInt(snapPoint)
  } else if (snapPoint > 1) {
    pixels = (snapPoint / 100) * containerHeight
  } else {
    pixels = snapPoint * containerHeight
  }

  // Para bottom drawer: quanto mais pixels, mais aberto
  // Y position = containerHeight - pixels
  return containerHeight - pixels
}
```

### Passo 3: Corrigir Release Logic

**Problema**: Procuramos "closest offset" ao invés de "closest position"

**Solução**:
```javascript
handleSnapPointRelease(delta, velocity) {
  // Posição atual do drawer (em pixels Y)
  const currentY = delta // Durante drag, delta É a posição Y

  // Encontra snap point mais próximo da posição atual
  let closestIndex = 0
  let closestDistance = Infinity

  this.snapPointsValue.forEach((snap, index) => {
    const snapY = this.getSnapPointY(index)
    const distance = Math.abs(currentY - snapY)

    if (distance < closestDistance) {
      closestDistance = distance
      closestIndex = index
    }
  })

  // Anima até o snap point
  this.snapTo(closestIndex)
}

snapTo(index) {
  const targetY = this.getSnapPointY(index)

  // Anima
  this.contentTarget.style.transition = 'transform 0.5s ...'
  this.contentTarget.style.transform = `translate3d(0, ${targetY}px, 0)`

  this.activeSnapPointValue = index
}
```

### Passo 4: Simplificar Offsets

**Problema**: Offsets são confusos e causam valores negativos

**Solução**: Esquecer "offsets", usar apenas Y positions

```javascript
// Não precisamos mais de snapPointOffsets!
// Calculamos Y position on-demand com getSnapPointY()
```

## Checklist de Mudanças

### Remover
- [ ] `this.snapPointOffsets` array
- [ ] `calculateSnapPointOffsets()` método
- [ ] `this.dragStartOffset` variável
- [ ] Lógica de "offset + delta" em updateTransform
- [ ] `getTransformForSnapPoint` durante drag
- [ ] Código de remover duplicados (desnecessário com Y positions)

### Adicionar
- [ ] `getSnapPointY(index)` - converte snap point para Y position
- [ ] Modificar `updateTransform` para usar apenas delta
- [ ] Modificar `show()` para posicionar no primeiro snap point
- [ ] Modificar `handleSnapPointRelease` para usar Y positions
- [ ] Modificar `snapTo` para usar Y positions

### Manter
- [ ] Velocity calculation
- [ ] `findClosestSnapPoint` (mas reformular para usar Y)
- [ ] Overlay opacity logic
- [ ] Data-state management

## Exemplo Completo: Bottom Drawer com [0.5, 1]

```javascript
// Container height: 600px
// Snap points: [0.5, 1]

// Snap 0.5 (50% aberto):
// pixels = 0.5 * 600 = 300px
// Y position = 600 - 300 = 300px (drawer 300px abaixo do topo)

// Snap 1.0 (100% aberto):
// pixels = 1.0 * 600 = 600px
// Y position = 600 - 600 = 0px (drawer no topo)

// Ao abrir (show):
transform = translate3d(0, 300px, 0) // Primeiro snap point

// Usuário arrasta para cima 100px:
delta = -100
transform = translate3d(0, -100px, 0) // Posição 200px

// Ao soltar:
currentY = -100 (posição atual)
snap 0: Y = 300, distance = |-100 - 300| = 400
snap 1: Y = 0,   distance = |-100 - 0|   = 100 ← mais próximo

// Anima para snap 1:
transform = translate3d(0, 0px, 0) // Totalmente aberto
```

## Prioridade de Implementação

1. **CRÍTICO**: Simplificar updateTransform (remove offset logic)
2. **CRÍTICO**: Implementar getSnapPointY
3. **CRÍTICO**: Modificar show() para posicionar no primeiro snap
4. **ALTO**: Reformular handleSnapPointRelease com Y positions
5. **ALTO**: Reformular snapTo com Y positions
6. **MÉDIO**: Remover código de offsets não usado
7. **BAIXO**: Cleanup de logs de debug

## Estimativa

- Tempo: 1-2 horas de refatoração
- Risco: Médio (muitas mudanças, mas simplifica)
- Benefício: ALTO (alinha 100% com Vaul)

## Referências

- `dev/vaul.md` - Como Vaul funciona
- `dev/snap-points.md` - Como snap points deveriam funcionar
- Vaul source: https://github.com/emilkowalski/vaul/blob/main/src/index.tsx