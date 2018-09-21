export class Card {

  static faces: string[][] = [
    ["🂡", "🂱", "🃁", "🃑"],
    ["🂢", "🂲", "🃂", "🃒"],
    ["🂣", "🂳", "🃃", "🃓"],
    ["🂤", "🂴", "🃄", "🃔"],
    ["🂥", "🂵", "🃅", "🃕"],
    ["🂦", "🂶", "🃆", "🃖"],
    ["🂧", "🂷", "🃇", "🃗"],
    ["🂨", "🂸", "🃈", "🃘"],
    ["🂩", "🂹", "🃉", "🃙"],
    ["🂪", "🂺", "🃊", "🃚"],
    ["🂫", "🂻", "🃋", "🃛"],
    ["🂭", "🂽", "🃍", "🃝"],
    ["🂮", "🂾", "🃎", "🃞"],
    ["🂠", "", "", ""]
  ];

  constructor(value: number, suitValue: number) {
    this.value = value;
    this.suitValue = suitValue;
  }

  private readonly value: number;
  private readonly suitValue: number;

  isTen(): boolean {
    return this.value > 8;
  }

  isAce(): boolean {
    return this.value == 0;
  }

  toString(): string {
    return Card.faces[this.value][this.suitValue];
  }
}