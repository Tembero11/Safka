enum DayType {
    Yesterday,
    Today,
    Tomorrow
}

export class OnlyDate extends Date {
    constructor(...args: []) {
        super(...args);

        this.setHours(0, 0, 0);
    }
    
    compare(date: Date | OnlyDate): DayType {
        throw new Error("Unimplemented");
    }
}