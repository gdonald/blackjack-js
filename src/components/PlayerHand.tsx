import React from 'react'
import Card from './Card'
import Game from './Game'
import Hand, { CountMethod, Status } from '../lib/Hand'
import { MenuType } from './menus/Menu'

export const MAX_PLAYER_HANDS: number = 7

class PlayerHand extends React.Component<{}, {}> {
  public static totalPlayerHands: number = 0

  public static clone(playerHand: PlayerHand): PlayerHand {
    const newPlayerHand = new PlayerHand(playerHand.game, playerHand.bet)

    for (const card of playerHand.hand.cards) {
      const newCard = new Card({
        value: card.props.value,
        suitValue: card.props.suitValue,
      })
      newPlayerHand.hand.cards.push(newCard)
    }

    return newPlayerHand
  }

  public hand: Hand
  public bet: number
  public status: Status = Status.Unknown
  public paid: boolean = false

  private game: Game
  private readonly playerHandID: number

  constructor(game: Game, bet: number) {
    super(game)
    this.game = game
    this.bet = bet
    this.hand = new Hand(game)
    this.playerHandID = PlayerHand.totalPlayerHands++

    this.dbl = this.dbl.bind(this)
    this.stand = this.stand.bind(this)
    this.hit = this.hit.bind(this)
  }

  public render() {
    const className = `${Game.isLinux() ? 'linux' : ''}${
      Game.isWindoze() ? 'windoze' : ''
    }`

    return (
      <div className={className} key={`phs-${this.playerHandID}`}>
        {this.hand.cards.map((card, key) => {
          return <span key={`ph-${card.cardID}-${key}`}>{card.render()}</span>
        })}
        <div className='count black'>
          ⇒ {this.getValue(CountMethod.Soft)} &nbsp;
          {this.statusDisplay()}
          {this.betDisplay()}
          {this.currentHandDisplay()} &nbsp;
          {this.statusDisplayText()}
        </div>
      </div>
    )
  }

  public hit(): void {
    if (!this.canHit()) {
      return
    }

    this.hand.dealCard()

    if (this.isDone()) {
      this.process()
      this.game.forceUpdate()
      return
    }

    this.game.forceUpdate()
  }

  public dbl(): void {
    if (!this.canDbl()) {
      return
    }

    this.hand.dealCard()
    this.hand.stood = true
    this.hand.played = true
    this.bet *= 2

    if (this.isDone()) {
      this.process()
    }

    this.game.forceUpdate()
  }

  public stand(): void {
    if (!this.canStand()) {
      return
    }

    this.hand.stood = true
    this.hand.played = true

    if (this.game.moreHandsToPlay()) {
      this.game.playMoreHands()
      return
    }

    this.game.playDealerHand()
    this.game.currentMenu = MenuType.MenuGame
    this.game.forceUpdate()
  }

  public process(): void {
    if (this.game.moreHandsToPlay()) {
      this.game.playMoreHands()
      return
    }

    this.game.playDealerHand()
    this.game.currentMenu = MenuType.MenuGame
    this.game.forceUpdate()
  }

  public canSplit(): boolean {
    if (this.hand.stood || this.game.playerHands.length >= MAX_PLAYER_HANDS) {
      return false
    }

    if (this.game.money < this.game.allBets() + this.bet) {
      return false
    }

    return (
      this.hand.cards.length === 2 &&
      this.hand.cards[0].props.value === this.hand.cards[1].props.value
    )
  }

  public canDbl(): boolean {
    if (this.game.money < this.game.allBets() + this.bet) {
      return false
    }

    return !(
      this.hand.stood ||
      this.hand.cards.length !== 2 ||
      this.isBusted() ||
      Game.isBlackjack(this.hand.cards)
    )
  }

  public canStand(): boolean {
    return !(
      this.hand.stood ||
      this.isBusted() ||
      Game.isBlackjack(this.hand.cards)
    )
  }

  public canHit(): boolean {
    return !(
      this.hand.played ||
      this.hand.stood ||
      21 === this.getValue(CountMethod.Hard) ||
      Game.isBlackjack(this.hand.cards) ||
      this.isBusted()
    )
  }

  public isDone(): boolean {
    if (
      this.hand.played ||
      this.hand.stood ||
      Game.isBlackjack(this.hand.cards) ||
      this.isBusted() ||
      21 === this.getValue(CountMethod.Soft) ||
      21 === this.getValue(CountMethod.Hard)
    ) {
      this.hand.played = true

      if (!this.paid) {
        if (this.isBusted()) {
          this.paid = true
          this.status = Status.Lost
          this.game.money -= this.bet
        }
      }

      return true
    }

    return false
  }

  public isBusted(): boolean {
    return this.getValue(CountMethod.Soft) > 21
  }

  public getValue(countMethod: CountMethod): number {
    let v
    let total = 0

    for (const card of this.hand.cards) {
      const tmpValue = card.props.value + 1
      v = tmpValue > 9 ? 10 : tmpValue

      if (countMethod === CountMethod.Soft && v === 1 && total < 11) {
        v = 11
      }

      total += v
    }

    if (countMethod === CountMethod.Soft && total > 21) {
      return this.getValue(CountMethod.Hard)
    }

    return total
  }

  public statusDisplay(): string {
    switch (this.status) {
      case Status.Won:
        return '+'
      case Status.Lost:
        return '-'
    }

    return ''
  }

  public statusDisplayText(): string {
    if (this.status === Status.Lost) {
      if (this.isBusted()) {
        return 'Busted!'
      } else {
        return 'Lose!'
      }
    } else if (this.status === Status.Won) {
      if (Game.isBlackjack(this.hand.cards)) {
        return 'Blackjack!'
      } else {
        return 'Won!'
      }
    } else if (this.status === Status.Push) {
      return 'Push'
    }

    return ''
  }

  public betDisplay(): string {
    return Game.formattedMoney(this.bet)
  }

  public currentHandDisplay(): string {
    if (!this.hand.played && this.game.currentPlayerHand() === this) {
      return ' ⇐'
    }

    return ''
  }
}

export default PlayerHand
