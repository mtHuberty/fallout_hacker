from random import choice

def defuseTheBomb(sequence):
    # Define rules
    rules = {"white": ["purple", "red", "green", "orange"],
            "red": ["green"],
            "black": ["black", "purple", "red"],
            "orange": ["black", "red"],
            "green": ["white", "orange"],
            "purple": ["black", "red"]}
    sequence = sequence.split()
    if(len(sequence) <= 1):
        return "Bomb defused"
    lastCut = sequence[0]
    sequence.pop(0)
    for wire in sequence:
        if(wire not in rules[lastCut]):
            return "Boom"
        else:
            lastCut = wire
    return "Bomb defused"


def falloutHacker():
    difficulty = input("Input game difficulty (1-5): ")
    f = open("enable1.txt", "r")
    rawData = f.read()
    f.close()
    # Generate list of words
    wordList = rawData.split()
    wordBank = [choice(wordList)]
    while(len(wordBank) < 3 * int(difficulty)):
        word = choice(wordList)
        if(word not in wordBank and len(word) == len(wordBank[0])):
            wordBank.append(word)
    print("\n".join(wordBank), "\n")
    # Try to guess
    answer = choice(wordBank)
    for i in range(0, 4):
        guess = input("Guess ({count} left): ".format(count=4 - i))
        if(guess == answer):
            print("{all}/{all} Correct! You Win!".format(all=len(answer)))
            break
        else:
            match = 0
            for j in range(0, len(answer)):
                if(guess[j] == answer[j]):
                    match += 1
            print("{match}/{all} Correct".format(match=match, all=len(answer)))


if __name__ == "__main__":
    # Defuse the Bomb
    print("Defuse the Bomb")
    input1 = "white red green white"
    print(defuseTheBomb(sequence=input1))
    input2 = "white orange green white"
    print(defuseTheBomb(sequence=input2))
    input3 = ""
    print(defuseTheBomb(sequence=input3))
    input4 = "white"
    print(defuseTheBomb(sequence=input4))
    # Fallout Hacker
    print("\nFallout Hacker")
    falloutHacker()