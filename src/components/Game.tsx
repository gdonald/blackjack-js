import React from 'react'
import { Cookies } from 'react-cookie'
import Card from './Card'
import DealerHand from './DealerHand'
import { CountMethod, Status } from '../lib/Hand'
import Menu, { MenuType } from './menus/Menu'
import PlayerHand from './PlayerHand'
import Shoe, { ShoeType } from '../lib/Shoe'

interface IPropsType {}

const MIN_BET: number = 500
const MAX_BET: number = 10000000
const MIN_NUM_DECKS: number = 1
const MAX_NUM_DECKS: number = 8
const START_MONEY: number = 10000

class Game extends React.Component {
  public static isLinux(): boolean {
    return (
      navigator.userAgent.indexOf('Linux') > -1 ||
      navigator.userAgent.indexOf('X11') > -1
    )
  }

  public static isWindoze(): boolean {
    return navigator.userAgent.indexOf('Windows') > -1
  }

  public static isBlackjack(cards: Card[]): boolean {
    if (cards.length !== 2) {
      return false
    }

    return (
      (cards[0].isAce() && cards[1].isTen()) ||
      (cards[1].isAce() && cards[0].isTen())
    )
  }

  public static formattedMoney(value: number): string {
    return (value / 100.0).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    })
  }

  public cookies: Cookies
  public numDecks: number = 8
  public shoeType: number = ShoeType.Regular
  public shoe: Shoe
  public dealerHand: DealerHand
  public playerHands: PlayerHand[] = []
  public currentPlayerHandIndex: number = 0
  public currentBet: number = MIN_BET
  public money: number = START_MONEY
  public menu: Menu
  public currentMenu: number = MenuType.MenuHand
  public mounted: boolean = false

  constructor(props: IPropsType) {
    super(props)

    this.cookies = new Cookies()
    this.loadGame()

    this.shoe = new Shoe(this.numDecks)
    this.dealerHand = new DealerHand(this)
    this.dealNewHand()
    this.menu = new Menu({ game: this })

    this.dealNewHand = this.dealNewHand.bind(this)
    this.insureHand = this.insureHand.bind(this)
    this.noInsurance = this.noInsurance.bind(this)
    this.getNewBet = this.getNewBet.bind(this)
    this.updateBet = this.updateBet.bind(this)
    this.gameOptions = this.gameOptions.bind(this)
    this.optionsBack = this.optionsBack.bind(this)
    this.getDeckType = this.getDeckType.bind(this)
    this.getDeckCount = this.getDeckCount.bind(this)
    this.updateDeckCount = this.updateDeckCount.bind(this)
    this.newRegular = this.newRegular.bind(this)
    this.newAces = this.newAces.bind(this)
    this.newJacks = this.newJacks.bind(this)
    this.newAcesJacks = this.newAcesJacks.bind(this)
    this.newSevens = this.newSevens.bind(this)
    this.newEights = this.newEights.bind(this)
    this.splitCurrentHand = this.splitCurrentHand.bind(this)
  }

  public render() {
    return (
      <>
        <div className='word black' key='d'>
          Dealer:
        </div>
        {this.dealerHand.render()}
        <div className='word black' key='p'>
          Player {Game.formattedMoney(this.money)}:
        </div>
        {this.playerHands.map((playerHand) => {
          return playerHand.render()
        })}
        {this.menu.render()}
      </>
    )
  }

  public componentDidMount() {
    this.mounted = true
  }

  public componentWillUnmount() {
    this.mounted = false
  }

  public dealNewHand(): void {
    if (this.shoe.needToShuffle()) {
      this.shoe.newShoe(this.shoeType)
    }

    this.playerHands = []
    PlayerHand.totalPlayerHands = 0
    this.playerHands.push(new PlayerHand(this, this.currentBet))
    const playerHand = this.playerHands[0]
    this.currentPlayerHandIndex = 0

    this.dealerHand = new DealerHand(this)

    this.dealerHand.hand.dealCard()
    playerHand.hand.dealCard()
    this.dealerHand.hand.dealCard()
    playerHand.hand.dealCard()

    if (
      this.dealerHand.upCardIsAce() &&
      !Game.isBlackjack(playerHand.hand.cards)
    ) {
      this.currentMenu = MenuType.MenuInsurance
      this.forceUpdateIfMounted()
      return
    }

    if (playerHand.isDone()) {
      this.dealerHand.hideDownCard = false
      this.payHands()
      this.currentMenu = MenuType.MenuGame
      this.forceUpdateIfMounted()
      return
    }

    this.currentMenu = MenuType.MenuHand
    this.forceUpdateIfMounted()
  }

  public forceUpdateIfMounted(): void {
    if (this.mounted) {
      this.forceUpdate()
    }
  }

  public formattedBet(): string {
    return (this.currentBet / 100.0).toLocaleString('en-US', {
      style: 'decimal',
    })
  }

  public currentPlayerHand(): PlayerHand {
    return this.playerHands[this.currentPlayerHandIndex]
  }

  public allBets(): number {
    let allBets = 0

    for (const playerHand of this.playerHands) {
      allBets += playerHand.bet
    }

    return allBets
  }

  public moreHandsToPlay(): boolean {
    return this.currentPlayerHandIndex < this.playerHands.length - 1
  }

  public needToPlayDealerHand(): boolean {
    for (const playerHand of this.playerHands) {
      if (!(playerHand.isBusted() || Game.isBlackjack(playerHand.hand.cards))) {
        return true
      }
    }

    return false
  }

  public splitCurrentHand(): void {
    if (!this.currentPlayerHand().canSplit()) {
      return
    }

    this.playerHands.push(new PlayerHand(this, this.currentBet))

    // expand hands
    let x = this.playerHands.length - 1
    while (x > this.currentPlayerHandIndex) {
      this.playerHands[x] = PlayerHand.clone(this.playerHands[x - 1])
      x--
    }

    // split
    const thisHand = this.currentPlayerHand()
    const splitHand = this.playerHands[this.currentPlayerHandIndex + 1]

    splitHand.hand.cards = []

    const c = thisHand.hand.cards[thisHand.hand.cards.length - 1]
    splitHand.hand.cards.push(c)
    thisHand.hand.cards.pop()

    const cx = this.shoe.getNextCard()
    thisHand.hand.cards.push(cx)

    if (thisHand.isDone()) {
      thisHand.process()
      return
    }

    this.currentMenu = MenuType.MenuHand
    this.forceUpdate()
  }

  public playMoreHands(): void {
    this.currentPlayerHandIndex++
    const h = this.currentPlayerHand()
    h.hand.dealCard()
    if (h.isDone()) {
      h.process()
      return
    }

    this.currentMenu = MenuType.MenuHand
    this.forceUpdate()
  }

  public playDealerHand(): void {
    if (Game.isBlackjack(this.dealerHand.hand.cards)) {
      this.dealerHand.hideDownCard = false
    }

    if (!this.needToPlayDealerHand()) {
      this.dealerHand.hand.played = true
      this.payHands()
      return
    }

    this.dealerHand.hideDownCard = false

    let softCount = this.dealerHand.getValue(CountMethod.Soft)
    let hardCount = this.dealerHand.getValue(CountMethod.Hard)
    while (softCount < 18 && hardCount < 17) {
      this.dealerHand.hand.dealCard()
      softCount = this.dealerHand.getValue(CountMethod.Soft)
      hardCount = this.dealerHand.getValue(CountMethod.Hard)
    }

    this.dealerHand.hand.played = true
    this.payHands()
  }

  public insureHand(): void {
    const playerHand = this.currentPlayerHand()

    playerHand.bet /= 2
    playerHand.hand.played = true
    playerHand.paid = true
    playerHand.status = Status.Lost

    this.money -= playerHand.bet

    this.currentMenu = MenuType.MenuGame
    this.forceUpdate()
  }

  public noInsurance(): void {
    if (Game.isBlackjack(this.dealerHand.hand.cards)) {
      this.dealerHand.hideDownCard = false
      this.dealerHand.hand.played = true

      this.payHands()

      this.currentMenu = MenuType.MenuGame
      this.forceUpdate()
      return
    }

    const playerHand = this.currentPlayerHand()
    if (playerHand.isDone()) {
      this.playDealerHand()
      this.currentMenu = MenuType.MenuGame
      this.forceUpdate()
      return
    }

    this.currentMenu = MenuType.MenuHand
    this.forceUpdate()
  }

  public payHands(): void {
    const dhv = this.dealerHand.getValue(CountMethod.Soft)
    const dhb = this.dealerHand.isBusted()

    for (const playerHand of this.playerHands) {
      if (playerHand.paid) {
        continue
      }

      playerHand.paid = true

      const phv = playerHand.getValue(CountMethod.Soft)

      if (dhb || phv > dhv) {
        if (Game.isBlackjack(playerHand.hand.cards)) {
          playerHand.bet *= 1.5
        }

        this.money += playerHand.bet
        playerHand.status = Status.Won
      } else if (phv < dhv) {
        this.money -= playerHand.bet
        playerHand.status = Status.Lost
      } else {
        playerHand.status = Status.Push
      }
    }

    this.normalizeCurrentBet()
    this.saveGame()
  }

  public gameOptions(): void {
    this.currentMenu = MenuType.MenuOptions
    this.forceUpdate()
  }

  public getDeckCount(): void {
    this.currentMenu = MenuType.MenuDeckCount
    this.forceUpdate()
  }

  public getDeckType(): void {
    this.currentMenu = MenuType.MenuDeckType
    this.forceUpdate()
  }

  public optionsBack(): void {
    this.currentMenu = MenuType.MenuGame
    this.forceUpdate()
  }

  public getNewBet(): void {
    this.currentMenu = MenuType.MenuBet
    this.forceUpdate()
  }

  public updateBet(event: any): void {
    event.preventDefault()
    const data = new FormData(event.target)
    const betValue = data.get('betValue')
    if (betValue === null) {
      return
    }

    this.currentBet = parseInt(betValue.toString(), 10) * 100
    this.normalizeCurrentBet()

    this.dealNewHand()
    this.currentMenu = MenuType.MenuHand
    this.forceUpdate()
    this.saveGame()
  }

  public normalizeCurrentBet(): void {
    if (this.currentBet < MIN_BET) {
      this.currentBet = MIN_BET
    } else if (this.currentBet > MAX_BET) {
      this.currentBet = MAX_BET
    }

    if (this.currentBet > this.money) {
      this.currentBet = this.money
    }
  }

  public updateDeckCount(event: any): void {
    event.preventDefault()
    const data = new FormData(event.target)

    const deckCountValue = data.get('deckCountValue')
    if (deckCountValue === null) {
      return
    }
    this.numDecks = parseInt(deckCountValue.toString(), 10)
    this.normalizeDeckCount()

    this.currentMenu = MenuType.MenuOptions
    this.forceUpdate()
    this.saveGame()
  }

  public normalizeDeckCount(): void {
    if (this.numDecks < MIN_NUM_DECKS) {
      this.numDecks = MIN_NUM_DECKS
    } else if (this.numDecks > MAX_NUM_DECKS) {
      this.numDecks = MAX_NUM_DECKS
    }
  }

  public normalizeShoeType(): void {
    if (this.shoeType < 0) {
      this.shoeType = ShoeType.Regular
    } else if (this.shoeType > ShoeType.ShoeTypeCount) {
      this.shoeType = ShoeType.Regular
    }
  }

  public newHandSelected(): void {
    this.currentMenu = MenuType.MenuHand
    this.dealNewHand()
    this.forceUpdate()
    this.saveGame()
  }

  public newRegular(): void {
    this.shoeType = ShoeType.Regular
    this.shoe.newRegular()
    this.newHandSelected()
  }

  public newAces(): void {
    this.shoeType = ShoeType.Aces
    this.shoe.newAces()
    this.newHandSelected()
  }

  public newJacks(): void {
    this.shoeType = ShoeType.Jacks
    this.shoe.newJacks()
    this.newHandSelected()
  }

  public newAcesJacks(): void {
    this.shoeType = ShoeType.AcesJacks
    this.shoe.newAcesJacks()
    this.newHandSelected()
  }

  public newSevens(): void {
    this.shoeType = ShoeType.Sevens
    this.shoe.newSevens()
    this.newHandSelected()
  }

  public newEights(): void {
    this.shoeType = ShoeType.Eights
    this.shoe.newEights()
    this.newHandSelected()
  }

  public saveGame(): void {
    const gameState = `${this.money}|${this.currentBet}|${this.numDecks}|${this.shoeType}`
    this.cookies.set('gameState', gameState, { path: '/', sameSite: 'strict' })
  }

  public loadGame(): void {
    const gameState = this.cookies.get('gameState')
    if (gameState === undefined) {
      return
    }

    const parts = gameState.toString().split('|')
    this.money = parseInt(parts[0], 10)
    this.currentBet = parseInt(parts[1], 10)
    this.numDecks = parseInt(parts[2], 10)
    this.shoeType = parseInt(parts[3], 10)

    this.normalizeCurrentBet()
    this.normalizeDeckCount()
    this.normalizeShoeType()

    if (this.money <= 0) {
      this.money = START_MONEY
    }
  }
}

export default Game
