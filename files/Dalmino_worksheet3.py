# Hanz Dee L. Dalmino BSIT II-B

# ==========================================
# PROBLEM 1: Creation, Initialization, and Traversal
# ==========================================

"""
leaderboard = [15000, 12500, 10000, 8500, 6000]
total_score = 0

for i in range(len(leaderboard)):
    print(f"Rank {i + 1}: {leaderboard[i]}")
    total_score += leaderboard[i]
    average_score = total_score / len(leaderboard)
 
print(f"Total Leaderboard Score: {total_score}")
print(f"Average Score: {average_score:.2f}")
"""

# ======================================================================
# PROBLEM 2: Linear Search & Direct Score Adjustment
# ======================================================================

"""
leaderboard = [15000, 12500, 10000, 8500, 6000]
target_score = int(input("Enter a target score: "))
found_index = -1
found = False

for i in range(len(leaderboard)):
    if leaderboard[i] == target_score:
        found_index = i
        print(f"Score {target_score} found at Rank {found_index + 1} Index ({i})")
        found = True
        break
        
        
if not found:
    print("Score not found on the leaderboard")

# Bonus
leaderboard[2] += 1500
print("Updating Rank 3 score with bonus...")
print(f"Updated Leaderboard: {leaderboard}")
"""

# ======================================================================
# PROBLEM 3: Manual Insertion (New #1 High Score via Right-Shift)
# ======================================================================

"""
leaderboard = [15000, 12500, 10000, 8500, 6000]

leaderboard.append(None)
# [15000, 12500, 10000, 8500, 6000, None]

for i in range(len(leaderboard) - 1, 0, -1):
    leaderboard[i] = leaderboard[i - 1]

leaderboard[0] = 20000

print(leaderboard)
"""

# ======================================================================
# PROBLEM 4: Manual Deletion (Banned Account via Left-Shift)
# ======================================================================

leaderboard = [15000, 12500, 10000, 8500, 6000]

# range (5-2 = 3, 5-1 = 4)
# start 3, stop 4
for i in range(len(leaderboard) - 2, len(leaderboard) - 1):
    leaderboard[i] = leaderboard[i + 1]
    
leaderboard.pop()

print(leaderboard)
    
