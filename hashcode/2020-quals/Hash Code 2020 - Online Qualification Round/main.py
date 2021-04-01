#/bin/env python3

import sys, math

_BOOKS_N = 0
_LIBRARY_N = 0
_DAYS_N = 0
_BOOKS = []
_LIBRARIES = []
_BOOKS_COUNTER = {}


def readFile():
	global _BOOKS_N, _LIBRARY_N, _DAYS_N, _BOOKS, _BOOKS_COUNTER
	
	if len(sys.argv) != 2:
		print(f'Usage ./{sys.argv[0]} input_file')
		exit(1)
	
	f = open(sys.argv[1], 'r')
	lines = f.readlines()
	f.close()
	
	_BOOKS_N, _LIBRARY_N, _DAYS_N = [int(k) for k in lines[0].split(' ')]
	
	_BOOKS = [int(k) for k in lines[1].split(' ')]
	_BOOKS_COUNTER = {k:0 for k in range(_BOOKS_N)}
	
	for k in range(_LIBRARY_N):
		booksN, signupTime, shippingRate = [int(j) for j in lines[2 + 2*k].split(' ')]
		desc = {'books_number': booksN, 'signup_time': signupTime, 'rate': shippingRate}
		desc['books'] = [int(j) for j in lines[2 + 2*k + 1].split(' ')]
		for b in desc['books']:
			_BOOKS_COUNTER[b] += 1
		_LIBRARIES.append(desc)

def evaluate1(sol):
	total = 0
	freeBooks = set(range(_BOOKS_N))
	day = 0
	lIdx = 0
	nextLibraryDate = _LIBRARIES[sol[lIdx]]['signup_time']
	activeLibraries = []
	
	while day < _DAYS_N:
		if day == nextLibraryDate:
			l = _LIBRARIES[sol[lIdx]]
			activeLibraries.append((set(l['books']), l['rate']))
			
			lIdx += 1
			if lIdx == len(sol):
				nextLibraryDate = -1
			else:
				nextLibraryDate = day + _LIBRARIES[sol[lIdx]]['signup_time']
		
		toRemove = []
		for idx,l in enumerate(activeLibraries):
			b = list(l[0].intersection(freeBooks))
			if len(b) == 0:
				toRemove.append(idx)
				continue
			b.sort(key=lambda x: _BOOKS[x], reverse=True)
			k = 0
			while k < l[1] and k < len(b):
				currScan = b[k]
				total += _BOOKS[currScan]
				freeBooks.remove(currScan)
				k += 1
			b = b[l[1]:]
			l = (set(b), l[1])
		
		toRemove.reverse()
		for k in toRemove:
			activeLibraries.pop(k)
		
		day += 1
	
	print(total)

def sol1():
	"""
	score = 26'189'039 (21 + 5822900 + 5645747 + 4815395 + 4664815 + 5240161)
	leaderboard = 1198th
	"""

	libraries = []
	sol = []
	
	# Generate constant value for each library
	for idx,l in enumerate(_LIBRARIES):
		l['sol1_value'] = sum((_BOOKS[k] for k in l['books']))
		r = l['sol1_value']/l['signup_time']
		libraries.append((idx, r))
	
	libraries.sort(lambda x: -x[1])
	days = _DAYS_N
	while days > 0:
		k = 0
		while k < len(libraries):
			l = libraries[k]
			if days - _LIBRARIES[l[0]]['signup_time'] > 0:
				days -= _LIBRARIES[l[0]]['signup_time']
				sol.append(l[0])
				libraries.pop(k)
				break
			k += 1
		if k == len(libraries):
			break
	
	print(sol)
	evaluate1(sol)

def evaluate2(sol):
	total = 0
	freeBooks = set(range(_BOOKS_N))
	day = 0
	lIdx = 0
	nextLibraryDate = _LIBRARIES[sol[lIdx]]['signup_time']
	activeLibraries = []
	
	while day < _DAYS_N:
		if day == nextLibraryDate:
			l = _LIBRARIES[sol[lIdx]]
			activeLibraries.append((set(l['books']), l['rate']))
			
			lIdx += 1
			if lIdx == len(sol):
				nextLibraryDate = -1
			else:
				nextLibraryDate = day + _LIBRARIES[sol[lIdx]]['signup_time']
		
		toRemove = []
		for idx,l in enumerate(activeLibraries):
			b = list(l[0].intersection(freeBooks))
			if len(b) == 0:
				toRemove.append(idx)
				continue
			
			# Optimization
			if math.ceil(len(b)/l[1]) <= _DAYS_N-day:
				freeBooks.difference_update(l[0])
				total += sum((_BOOKS[k] for k in b))
				toRemove.append(idx)
				continue
			
			b.sort(key=lambda x: _BOOKS[x], reverse=True)
			k = 0
			while k < l[1] and k < len(b):
				currScan = b[k]
				total += _BOOKS[currScan]
				freeBooks.remove(currScan)
				k += 1
			b = b[l[1]:]
			activeLibraries[idx] = (set(b), l[1])
		
		toRemove.reverse()
		for k in toRemove:
			activeLibraries.pop(k)
		
		day += 1
	
	print(total)
	print('Max is', sum(_BOOKS))

def sol2():
	"""
	score = 26'414'134 (21 + 5822900 + 5689822 + 5028400 + 4664815 + 5208176)
	leaderboard = 954th
	"""

	libraries = {idx:v for idx,v in enumerate(_LIBRARIES)}
	freeBooks = set(range(_BOOKS_N))
	sol = []
	
	days = _DAYS_N
	while days > 0:
		# ~ print(days, len(libraries))
		k = 0
		
		# Choose best library
		bestVal = 0
		bestLibrary = -1
		for idx,l in libraries.items():
			b = set(l['books']).intersection(freeBooks)
			l['sol1_value'] = sum((_BOOKS[k] for k in b))
			r = l['sol1_value']/l['signup_time']
			if r > bestVal and days - l['signup_time'] > 0:
				bestVal = r
				bestLibrary = idx
		
		if bestLibrary == -1:
			break
		
		rate = libraries[bestLibrary]['rate']
		books = libraries[bestLibrary]['books']
		signupTime = libraries[bestLibrary]['signup_time']
		days -= signupTime
		if math.ceil(len(books)/rate) <= days:
			freeBooks.difference_update(set(books))
		sol.append(bestLibrary)
		libraries.pop(bestLibrary)
	
	print(sol)
	evaluate2(sol)

def sol3():
	"""
	score = 26'966'790 (21 + 5822900 + 5689822 + 5028530 + 5117483 + 5308034)
	leaderboard = 124th
	"""

	libraries = {}
	for idx,v in enumerate(_LIBRARIES):
		libraries[idx] = v.copy() 
		# Optimization. Remove all the useless books
		r = libraries[idx]['rate']
		b = libraries[idx]['books']
		b.sort(key=lambda x: _BOOKS[x], reverse=True)
		libraries[idx]['books'] = set(b[:r*(_DAYS_N-libraries[idx]['signup_time'])])
		# ~ b = libraries[idx]['books']
		# ~ libraries[idx]['books'] = set(b)
	usedBooks = set()
	sol = []
	changed = False
	
	days = _DAYS_N
	while days > 0:
		k = 0
		
		# Choose best library
		bestVal = 0
		bestLibrary = -1
		for idx,l in libraries.items():
			b = None
			if changed:
				l['books'].difference_update(usedBooks)
				b = l['books']
			else:
				b = l['books']
			
			r = l['rate']
			daysLeft = days - l['signup_time']
			if r*daysLeft >= len(b):
				l['score'] = sum((_BOOKS[k] for k in b))
			else:
				b = list(b)
				b.sort(key=lambda x: _BOOKS[x], reverse=True)
				l['score'] = sum((_BOOKS[k] for k in b[:r*daysLeft]))
			
			uselessDays = daysLeft - r*len(b)
			if uselessDays < 1:
				uselessDays = 1
			
			h = l['score']/(l['signup_time'] * uselessDays)
			if h > bestVal and days - l['signup_time'] > 0:
				bestVal = h
				bestLibrary = idx
		
		if bestLibrary == -1:
			break
		
		changed = False
		rate = libraries[bestLibrary]['rate']
		books = libraries[bestLibrary]['books']
		signupTime = libraries[bestLibrary]['signup_time']
		days -= signupTime
		if math.ceil(len(books)/rate) <= days:
			usedBooks = set(books)
			changed = True
		sol.append(bestLibrary)
		libraries.pop(bestLibrary)
	
	# ~ print(sol)
	evaluate2(sol)

def sol4():
	"""
	score = 26'979'462 (21 + 5822900 + 5690012 + 5028530 + 5129736 + 5308263)
	leaderboard = 112th
	"""

	libraries = {}
	for idx,v in enumerate(_LIBRARIES):
		libraries[idx] = v.copy()
		b = libraries[idx]['books']
		libraries[idx]['books'] = set(b)
	allRemovedBooks = set()
	sol = []
	activeLibraries = []
	total = 0
	
	days = _DAYS_N
	while days > 0:
		k = 0
		
		# Choose best library
		bestVal = 0
		bestLibrary = -1
		for idx,l in libraries.items():
			b = None
			if len(allRemovedBooks) > 0:
				l['books'].difference_update(allRemovedBooks)
				b = l['books']
			else:
				b = l['books']
			
			if len(b) == 0:
				continue
			r = l['rate']
			daysLeft = days - l['signup_time']
			if r*daysLeft <= 0:
				continue
			if r*daysLeft >= len(b):
				l['score'] = sum((_BOOKS[k] for k in b))
			else:
				b = list(b)
				b.sort(key=lambda x: _BOOKS[x], reverse=True)
				l['score'] = sum((_BOOKS[k] for k in b[:r*daysLeft]))
			
			uselessDays = daysLeft - r*len(b)
			if uselessDays < 1:
				uselessDays = 1
			
			h = l['score']/(l['signup_time'] * uselessDays)
			if h > bestVal and days - l['signup_time'] > 0:
				bestVal = h
				bestLibrary = idx
		
		# progress day by day until days-signupTime
		if bestLibrary == -1:
			nextDecisionDay = 0
		else:
			nextDecisionDay = days - libraries[bestLibrary]['signup_time']
		while days > nextDecisionDay and days > 0:
			toRemove = []
			usedBooks = set()
			for idx,l in enumerate(activeLibraries):
				allRemovedBooks.update(usedBooks)
				rate = l['rate']
				b = list(l['books'].difference(allRemovedBooks))
				b_size = len(b)
				if b_size == 0:
					toRemove.append(idx)
					continue
				
				# Optimization
				if math.ceil(b_size/rate) <= days:
					usedBooks.update(b)
					total += sum((_BOOKS[k] for k in b))
					toRemove.append(idx)
					continue
				
				# Get the best availables
				b.sort(key=lambda x: _BOOKS[x], reverse=True)
				k = 0
				while k < rate and k < b_size:
					currScan = b[k]
					total += _BOOKS[currScan]
					usedBooks.add(currScan)
					k += 1
				b = b[rate:]
				l['books'] = set(b)
			
			allRemovedBooks = usedBooks
			
			# Removing empty libraries
			toRemove.reverse()
			for k in toRemove:
				activeLibraries.pop(k)
			
			days -= 1
		
		if bestLibrary != -1:
			libraries[bestLibrary]['books'].difference_update(allRemovedBooks)
			
			# Optimization
			if math.ceil(len(libraries[bestLibrary]['books'])/libraries[bestLibrary]['rate']) <= days:
				allRemovedBooks.update(libraries[bestLibrary]['books'])
				total += sum((_BOOKS[k] for k in libraries[bestLibrary]['books']))
			else:
				activeLibraries.append(libraries[bestLibrary])
			
			sol.append(bestLibrary)
			libraries.pop(bestLibrary)
	
	print(sol)
	print(total)
	print('Max is', sum(_BOOKS))

def sol5():
	"""
	score = 27'001'434 (21 + 5822900 + 5593787 + 5039450 + 5227768 + 5317508)
	leaderboard = 74th
	"""

	libraries = {}
	for idx,v in enumerate(_LIBRARIES):
		libraries[idx] = v.copy()
		b = libraries[idx]['books']
		libraries[idx]['books'] = set(b)
	allRemovedBooks = set()
	sol = []
	activeLibraries = []
	total = 0
	
	days = _DAYS_N
	while days > 0:
		k = 0
		
		# Choose best library
		bestVal = 0
		bestLibrary = -1
		for idx,l in libraries.items():
			b = None
			if len(allRemovedBooks) > 0:
				l['books'].difference_update(allRemovedBooks)
				b = l['books']
			else:
				b = l['books']
			
			if len(b) == 0:
				continue
			r = l['rate']
			daysLeft = days - l['signup_time']
			if r*daysLeft <= 0:
				continue
			if r*daysLeft >= len(b):
				partialSum = 0
				partialDiv = 0
				for k in b:
					partialSum += _BOOKS[k]
					partialDiv += _BOOKS_COUNTER[k]
				l['score'] = partialSum**2/(partialDiv**0.9)
			else:
				b = list(b)
				b.sort(key=lambda x: _BOOKS[x], reverse=True)
				partialSum = 0
				partialDiv = 0
				for k in b[:r*daysLeft]:
					partialSum += _BOOKS[k]
					partialDiv += _BOOKS_COUNTER[k]
				l['score'] = partialSum**2/(partialDiv**0.9)
			
			uselessDays = daysLeft - r*len(b)
			if uselessDays < 1:
				uselessDays = 1
			
			h = l['score']/(l['signup_time'] * uselessDays)
			if h > bestVal and days - l['signup_time'] > 0:
				bestVal = h
				bestLibrary = idx
		
		# progress day by day until days-signupTime
		if bestLibrary == -1:
			nextDecisionDay = 0
		else:
			nextDecisionDay = days - libraries[bestLibrary]['signup_time']
		while days > nextDecisionDay and days > 0:
			toRemove = []
			usedBooks = set()
			for idx,l in enumerate(activeLibraries):
				allRemovedBooks.update(usedBooks)
				rate = l['rate']
				b = list(l['books'].difference(allRemovedBooks))
				b_size = len(b)
				if b_size == 0:
					toRemove.append(idx)
					continue
				
				# Optimization
				if math.ceil(b_size/rate) <= days:
					usedBooks.update(b)
					total += sum((_BOOKS[k] for k in b))
					toRemove.append(idx)
					continue
				
				# Get the best availables
				b.sort(key=lambda x: _BOOKS[x], reverse=True)
				k = 0
				while k < rate and k < b_size:
					currScan = b[k]
					total += _BOOKS[currScan]
					usedBooks.add(currScan)
					k += 1
				b = b[rate:]
				l['books'] = set(b)
			
			allRemovedBooks = usedBooks
			
			# Removing empty libraries
			toRemove.reverse()
			for k in toRemove:
				activeLibraries.pop(k)
			
			days -= 1
		
		if bestLibrary != -1:
			libraries[bestLibrary]['books'].difference_update(allRemovedBooks)
			
			# Optimization
			if math.ceil(len(libraries[bestLibrary]['books'])/libraries[bestLibrary]['rate']) <= days:
				allRemovedBooks.update(libraries[bestLibrary]['books'])
				total += sum((_BOOKS[k] for k in libraries[bestLibrary]['books']))
			else:
				activeLibraries.append(libraries[bestLibrary])
			
			sol.append(bestLibrary)
			libraries.pop(bestLibrary)
	
	print(sol)
	print(total)
	print('Max is', sum(_BOOKS))

def main():
	readFile()
	
	# First solution, knapsack problem with optimizations
	# ~ sol1()
	
	# Better scheduling of books
	# ~ sol2()
	
	# Choosing libraries with heuristics
	# ~ sol3()
	
	# Improved heuristic and real time book removing
	# ~ sol4()
	
	# More speculative heuristic. Has better results in some cases
	sol5()
	
	# Sum of the bests = 27'097'659 (21 + 5822900 + 5690012 + 5039450 + 5227768 + 5317508)
	# leaderboard = 20th

if __name__ == '__main__':
	main()
