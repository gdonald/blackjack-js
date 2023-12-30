import Card from '../components/Card'

export enum ShoeType {
  Regular,
  Aces,
  Jacks,
  AcesJacks,
  Sevens,
  Eights,
  ShoeTypeCount,
}

class Shoe {
  public static shuffleSpecs: number[][] = [
    [95, 8],
    [92, 7],
    [89, 6],
    [86, 5],
    [84, 4],
    [82, 3],
    [81, 2],
    [80, 1],
  ]

  public static shuffleArray(cards: Card[]) {
    let currentIndex: number = cards.length
    let temporaryValue: Card
    let randomIndex: number

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1

      temporaryValue = cards[currentIndex]
      cards[currentIndex] = cards[randomIndex]
      cards[randomIndex] = temporaryValue
    }

    return cards
  }

  public numDecks: number = 1
  public cards: Card[] = []

  constructor(numDecks: number) {
    this.numDecks = numDecks

    this.newRegular = this.newRegular.bind(this)
  }

  public needToShuffle(): boolean {
    if (this.cards.length === 0) {
      return true
    }

    const totalCards = this.numDecks * 52
    const cardsDealt = totalCards - this.cards.length
    const used = (cardsDealt / totalCards) * 100.0

    for (let x = 0; x < 8; x++) {
      if (
        used > Shoe.shuffleSpecs[x][0] &&
        this.numDecks === Shoe.shuffleSpecs[x][1]
      ) {
        return true
      }
    }

    return false
  }

  public shuffle(): void {
    for (let i = 0; i < 7; i++) {
      this.cards = Shoe.shuffleArray(this.cards)
    }
  }

  public newShoe(shoeType: ShoeType): void {
    switch (shoeType) {
      case ShoeType.Regular:
        this.newRegular()
        break
      case ShoeType.Aces:
        this.newAces()
        break
      case ShoeType.Jacks:
        this.newJacks()
        break
      case ShoeType.AcesJacks:
        this.newAcesJacks()
        break
      case ShoeType.Sevens:
        this.newSevens()
        break
      case ShoeType.Eights:
        this.newEights()
        break
    }
  }

  public newRegular(): void {
    this.cards = []

    for (let deck = 0; deck < this.numDecks; deck++) {
      for (let suitValue = 0; suitValue < 4; suitValue++) {
        for (let value = 0; value < 13; value++) {
          this.cards.push(new Card({ value, suitValue }))
        }
      }
    }

    this.shuffle()
  }

  public newEights(): void {
    this.cards = []

    for (let deck = 0; deck < this.numDecks * 5; deck++) {
      for (let suitValue = 0; suitValue < 4; suitValue++) {
        this.cards.push(new Card({ value: 7, suitValue }))
      }
    }

    this.shuffle()
  }

  public newSevens(): void {
    this.cards = []

    for (let deck = 0; deck < this.numDecks * 5; deck++) {
      for (let suitValue = 0; suitValue < 4; suitValue++) {
        this.cards.push(new Card({ value: 6, suitValue }))
      }
    }

    this.shuffle()
  }

  public newAces(): void {
    this.cards = []

    for (let deck = 0; deck < this.numDecks * 5; deck++) {
      for (let suitValue = 0; suitValue < 4; suitValue++) {
        this.cards.push(new Card({ value: 0, suitValue }))
      }
    }

    this.shuffle()
  }

  public newJacks(): void {
    this.cards = []

    for (let deck = 0; deck < this.numDecks * 5; deck++) {
      for (let suitValue = 0; suitValue < 4; suitValue++) {
        this.cards.push(new Card({ value: 10, suitValue }))
      }
    }

    this.shuffle()
  }

  public newAcesJacks(): void {
    this.cards = []

    for (let deck = 0; deck < this.numDecks * 5; deck++) {
      for (let suitValue = 0; suitValue < 4; suitValue++) {
        this.cards.push(new Card({ value: 0, suitValue }))
        this.cards.push(new Card({ value: 10, suitValue }))
      }
    }

    this.shuffle()
  }

  public getNextCard(): Card {
    const card = this.cards.pop()

    if (card === undefined) {
      throw new Error('No cards left in the shoe')
    }

    return card
  }
}

export default Shoe
