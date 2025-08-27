import { Database } from '$lib/database';
import type { Prisma, Quiz } from '@prisma/client';
import { getRandomDateForQuarterAndSequence, getReadableTitleOfQuiz } from '$lib/dataUtils';
import {
	studentGroup1Marcos,
	studentGroup2Burke,
	studentGroup3Doherty,
	studentGroup4Schillo,
	studentGroup5Boyle,
	studentGroup6Eklund,
	studentGroup7Mitchinson,
	studentGroup8RosalesMedina
} from './datasets';
import type { Page } from '@playwright/test';
import { addSeconds } from 'date-fns';

const db = new Database();

export function getCurrentYearInt() {
	const now = new Date();
	const currentYear = now.getFullYear();
	const isAfterJuly1 = now.getMonth() >= 6; // July is month 6 (0-indexed)

	const currentSchoolYearStart = isAfterJuly1 ? currentYear : currentYear - 1;
	const nextYear = currentSchoolYearStart + 1;

	return parseInt(`${currentSchoolYearStart.toString().slice(-2)}${nextYear.toString().slice(-2)}`);
}

// NOTE: Seed Data Functions //////////////////////////////////////////

const sampleJpgBase64 =
	'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAGQAyADASIAAhEBAxEB/8QAGwABAAIDAQEAAAAAAAAAAAAAAAQFAgMGAQf/xABHEAACAgEBBAYHBgMFBwQDAQAAAQIDBBEFEiExBkFRYXGRExQiMlKBoUJiscHR4SMzchVjkqLwJDQ1U1Sy8RZDc4Ilk+LC/8QAGwEBAAIDAQEAAAAAAAAAAAAAAAQFAQIDBgf/xAA4EQACAgECAwQHBwQDAQEAAAAAAQIDBBExBRIhEyJBUTJhcYGRodEGFEJSseHwFSMzwUNT8SQW/9oADAMBAAIRAxEAPwDsQAeDJQAAAAAAAAAAAAAAAAAAPJPdi32LU9IO27PRbFzZ9foZJeLWh0pr7WyMF4tL4mG9FqfKgAfdCsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPsYAPg5aAAAAAAAAAAAAAAAAAAAoemeQqdgWQb0ldOMFp46/kXxwvTvLdm0KcWMnu0w3mvvP9kvMu/s/jPI4hWvCL5n7v30OVstIM5YAH10gAAAAAAAAAAAAAAAAAAAAyjGUnpFN+CMNpLVmUm3ojEG+OJbLqS8WbVg/FPyRAs4niV+lNe7r+hNr4dlWbQfv6fqQwWEcOpc9ZeLNioqjyrj8+JBs4/jR9FNkyHBL36TSKwyVc5coSfgi0UUuSSPSJP7RP8ABX8X+xKjwJfin8v3K1Y1z+w/MyWHa+e6vFlgCLLj2S9kl7v3JMeC463bf89hCWC+uaXgjJYK67PoSwRnxjNf4/kvod1wrEX4fm/qRVhQ65SMvUqu2XmSAcnxPLf/ACM6rh+KvwIj+p1fe8x6nV97zJANf6jl/wDYzP3DG/IiP6nV97zHqdX3vMkAf1HL/wCxj7hjfkRGeFX8UvM8eDHqm/IlA3XFMxf8j+Ro+G4r/AiG8Hss+hi8KfVKL8ScDtHjWYt5a+5HOXCcR7R097K94dq6k/mY+rXL7H1RZA7x4/krdJ+5/U4y4JjvZtfD6FW6bVzrl5GLjJc4tfItgd4/aGz8Va+JwlwKH4Zv4FOC3aT5pMxdVb51x8jvH7Qw/FW/j+yOMuBS/DP5FUCzeNS/sL5GLw6nyTXgyRHj+M9018PqcZcEyFs0/wCewrgTngx+zNrxRrlhTXuyT+hJhxfDn+PT2pkafC8qP4dfZoRQbpYty+zr4M1yrnH3oSXiibXk02ehNP3oiTx7a/Ti17jEAHc4gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH2MAHwctAAAAAAAAAAAAAAAAAAA2ktW9Ej5RtbLeftTJyddVZNuP9PJfTQ+g9J871DYl84tqy3+FBp6aN/tqfMj3/ANj8TSFmS/Hov1f+vgRMiW0QAD3JGAAAAAAAAAAAAAMoQlOWkU2yXVhrna9e5EPKzqMVa2S6+XiSsfDuyH/bXTz8CJGMpPSKbfciRXhzlxm1FebJsYxgtIpJdx6ebyOPXT6UrlXxf0PQUcFqj1ter+CNMMWqH2d5/e4m1JJaJaI9BSW323PWyTftLeumupaQikAAcjqAAAAAAAAAAAAAEm3olqb4YWVN6Kiz5x0MNpbmHJLdmgE2OysyT/lJeMkbFsXKf2ql83+ho7YLxOburX4kVwLL+xMn/mVeb/QyWw7uu2v6mO2r8zX7xV5lWC2/sKen8+P+E9Wwpacchf4f3MdvX5mPvNXmVALj+wn/ANR/k/cf2E/+oX+D9zH3ivzH3qrzKcFx/YT/AOo/yfuP7Cf/AFC/wfuPvFfmPvVXmU4LZ7Cn9m+L8Y6GD2Jfpwsrfjr+hnt6/Mysmp+JWAsZbGylydb8JGuWysxPhUn4SRsrYPxNldW/xIhAkTwMqHOifyWv4Gmdc63pOEovvWhspJ7M3UovZmIANjYAAAwlVXL3oRfyNUsOt+63EkAk1ZmRT6E2iPZi0W+nBMgywpr3ZJ+PA0zpsh70Gi0BaU8eyIemlL5fp9Cut4LRL0G18/58SnBazqrn70EzRPCg/ck0+/iW1PHsefSxOPzX89xV28Fvh1g1L5fz4kEG+eJbHklJdxpaaejTT7y2qyKrlrXJMrLaLanpZFo8AB3OIAAAAAAAAAPTwAAAAAAAAAAAAAAAAAAAAAAAAAAAAH2MAHwctAAAAAAAAAAAAAAAAAYX2woosute7CuLlJ9iRlJyeiBw/TrN9LtCrDi/ZojrL+qX7aeZy5vzcmWbm3ZM9d62blo3rpr1fLkaD7Tw3EWHi10eS6+3d/MrZy5pNgAE41AAAAAAABlCEpy3YrVmspKK1k9EZjFyei3MSRTiys4y9mP1ZIoxY16OXtS+iJB5nO45vDG+P0PRYfB9p5Hw+pjCEa46RWiMgDzEpOT5pPVnoYxUVpFaIAAwbAAAAAAAAl0bMyrtGq9yL658P3NZSUerZrKUYrWTIgLunYla43Wyk+yK0RPow8fH/lVRT7eb8zhLKgtupFnmQW3U5unEyL9PR1Skn16aLzJlWxciWjsnCC61zaL8HCWVN7dCNLMm9uhV17Eojp6Syc33cESq9nYlfu0Rf9XtfiSgcXbN7s4SusluzyMVFaRSSXUkegHM5AAAAAAAAAAAAAAAAAAAAAA8aTWjWqPQAR7MLGs13qIcebS0f0Il2xaJ8apyrfmizBvGycdmdY3Tjsznrdj5MOMN2xdz0f1INlVlUt2yEoPsktDrzGcIWR3ZxjJdjWpIjlSXpIkwzZL0lqcgDortkYtvGMXW/uvh5FfbsXIhq65QsXZyZIjkQl46EqGVXLx0K0G23Huo/m1Sj3tcPM1HZNPYkJp9UAAZMg8lGM1pKKa7z0GVJxeqMNKS0ZHnh1y91uL8yPPEsjy0ku4sAWlHGMqnpzcy9f13K67heNb+HR+r+aFQ04vRpp9jPC3lCM1pKKa7yPPCg/cbj9S7x+PUz6WrlfxX1Ka/gtsOtT5vkyADdPGth9nVdq4mku6rq7VzVyTXqKiyqdT0mmgADqcwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD7GAD4OWgAAAAAAAAAAAAAAAOa6b57x9mwxIS0nkP2tHx3V++h0p8y6S7QjtHbNttb1qh/Drfal1/N6s9H9msL7znKcl3Ydff4fPr7jjdLlj7SpAB9VIIAAAAAAAN2Pju56vhFc2crroUQdlj0SOtVU7pqEFq2eUUSulw4RXNlhXXGqO7FfuZRioRUYrRI9PD8Q4lZly02j4L6nsMHh8MWOu8vP6AAFYWIAAAAAABnVVZdNQrg5SfUi2xdipNSyZa/cj+bOc7Iw3OVlsK/SZU002Xz3KoOUu4s8fYkpJSyLN37sefmXFdcKoKFcFGK6kjMhzyZP0ehAszJS6R6GjHw6Mb+VWk/ifF+ZvAIzbfVkNycnqwADBgAAAAGcabZcq5eRjXQNpbmAN6w739jTxaM1gW9cooxzx8zR2RXiRQTFs99dn0MlgQ65yfgjXtImO1h5kEFh6hV8U/NHvqNXbLzMdrEx20SuBY+o0/e8x6lTp9rzHaxMdtErgWHqFXxT80YPZ619mxpd6M9rEz20CECU8CxcpRZreLcvsP5M2U4vxN1OL8TSDKVc4rWUJJd6MTY2AAAAAAAAAAAAAAAPGk1o1qmRrtn4t2u9VFPtjwZKBlScdmbRk49UylyNiSXHHs1+7P8AUrbsa7H/AJtco975eZ1h40mtGtUSIZMlv1JUMycfS6nHg6PI2XjXcVD0cu2HD6FbfsfIqWtbVq7uD8iVDIhL1EyGVXPx0K4HsoyhJxlFxkuaa0aPDuSQAAAa7KK7Pejx7VzNgN67Z1S5oPRmk64WLlmtUQbMOceMHvLs6yM009GtH2MtzGdcLFpOKZfYvHrIdL1zLzW/0/QpcjgtcutL09XgVIJlmF11y+TIs4Sg9JRa8T0eNnUZK/ty6+XiUGRh3Y7/ALkenn4GIAJhFAAAAAAAAAAAAAAAAAAAAAAAAPsYAPg5aAAAAAAAAAAAAAAAFT0l2j/Zux7Zxlu3Wfw6/F9fyWrPmR0PTPaEcza3oK3rDGThrrzl9r8l8jnj6v8AZvA+6YSlJd6fV/6Xw6+8g3S5pAAHoTiAAAADbRS7p6cormznbbCqDnN6JHSuuVs1CC1bMseh2vV8ILmywjFRilFaJCMVCKjFaJHp4PiGfPMnrtFbL+eJ7PBwoYsNN5Pd/wA8AACvJ4AAAAJmJs6/K0kluV/FL8u01lJRWrNZSUVrJkNJtpJat9Ra4ex5z0nkvcj8C5/PsLLEwKcRaxW9Prm+f7EohWZLfSBX25bfSBqox6seO7VBRXdzZtAIjbfVkFtt6sAAGAAk29Em32Ik1YVk9HN7i+phyS3MSko7kYzrost9yLa7eosa8Wqv7O8+2XE3HF3eRwlf5EGGA/tz+SRvhiUx+zvPvZvBzc5PxOLsk/E8jGMV7MUvBHoBoaAAAAAAAAAAAAAAAAAAAxlXCfvRi/FGQANMsWmT13NPB6GqWBD7M5Lx4ksGynJeJurJLxK6WDatd1xkaZUWw96uXlqW4N1a/E3V8vEpQW86oWe/FM0Twa37knH6o6K1Pc6q+L3K8EmeDbH3WpfQ0Tqsr9+DXfobqSex0U4vZmIANjYAAAAAAAAA13UVXx0trjJd6KzJ2JF6yxp7r+GXLzLcG8LJQ2Z1hbOHos5S/Evx2/S1yS+LmvM0nYEPI2ZjX6vc9HLthw+hLhlL8SJsM1fjRzYLDI2RkVauvS2K7OD8iA04tqSaa5pkqM4y2ZMhOM1rFngANjcHkoqS0kk13noMptPVGGk1oyJbhJ8a3p3MiThKt6Ti0Wx5KKktJJNdjLvE43dV3be8vn8fqU+Twem3rX3X8ioBMuw+uryZEacW01o0epxcynKjrW/d4o83kYluNLSxe/wPAASyMAAAAAAAAAAAAAAAAAAfYwAfBy0AAAAAAAAAAAABE2pnQ2ds6/Knx9HH2V2y5JeZLOH6cbTV2RXgUzbjS961Lk5dS+S18y04RgPOy41fh3fsX1295pZLljqctZOVtkrJvenJuUn2tmIB9jSSWiK4AAyAAepNtJcWzDenVmUtTKut2TUY9f0LKquNUFGP/kxx6fQ16P3nzNp4jivEXkz5IPuL5+v6Hr+G4Cx4c8/Sfy9X1AAKctgAAAZQhKyahCLlJ8kjdiYduXZuwWkVzk+SOgw8KrEhpBayfOb5s4W3Kvp4ka7IjX03ZDwdkQr0nk6Tl1R6l+paHoK+c5TerKudkrHrIAA0OYB7CEpy3Ypt9xNpwUlra9X8KNZSUdzWU1HchwrlZLSEW2SqsB87ZadyJsYxgtIpJdiPThK1vYjSub2MK6oVrSEUjMA5bnFvUAAAAAAAAAA05OZj4sdci6FfDXST4vwXWVOR0owq9VTCy59T03U/Pj9DpCmyfoo5zthD0mXgOQv6U5k9VTXVUnyem81+X0K67aufc255dvHg1GW6vJEuOBY9+hGlm1rbqd5bfTStbbYVr70kiFdt3ZtLaeTGTXVBOX1XA4Vtt6s8JEeHRXpSOEs6Xgjr7OlWGk9ym+T70kvxIs+lsmnuYaT6m7NfyOaB2WFSvA4vLtfiXz6V5n2aKF4pv8zCXSjPb1UaF3KL/UpAdFjUr8Jp94t/MXT6T7Qen8lf/T9w+k+0Hp/JX/0/cpQPu1X5UY7e38zLpdJ9oL/kvxh+56ulGepauNLXY4v9SkA+7VflRn7xb+Yvl0qzeunH/wAMv1M49LMjX2saprubRzwMfdafymfvNv5jp49LfiwvK39jfX0rxGv4lF0X93R/mjkQaPCpfgbLLtXidrX0k2bP3rJ1/wBUH+WpKq2ts+56Qy6tfvPd/E4AHN8PrezZ0WdYt0j6VCcbI70JKS7U9TI+bV22VTU6pyhJcnF6MssXpBtDH0TtV0V1WLX68yPPh8l6L1O8c6L9JaHY2Y1VnOCT7VwI1uDNca3vLsfBlbjdK6JaLJonW/ig95ft9S5xc3GzI6490LNOaT4r5cyNKF1XpInVZSl6MiunCUHpOLT7zwuWk1o0muxke3Crnxj7D7uQVq8SXG9eJXA32YltfJby7UaDqmnsdlJPYAAyZAAAAAABpvxachaW1qXf1+ZuBlNrqjKbT1RRZWxrK9ZY8vSR+F8/3KycZQk4zi4yXNNaM7A05GNTkx3boKWnJ9a+ZKrymukibXmSXSfU5QFhmbJuo1lVrbDuXtL5FeTYzjJaosITjNaxYABsbgwsqhatJL59aMwbQnKuSlB6NGs4RnHlktUV12NKrVr2o9vYaC4It+Ipe1WtH2dR6nA42paV5PR+f1POZvB3HWdHw+hBB604tprRo8PSJprVHn2mnowADJgAAAAAAAAAAAA+xgA+DloAAAAAAAAAAAAQtsbRr2Xs+zJno5LhCL+1LqR8stsndbO2yTlOcnKUn1t82X3S/a62hnLGpb9BjtrX4p9b/JfPtOePqf2b4b9zxe0mu/Pq/UvBf7IN0+aWiAAPSnEAAAE7Eo3V6Sa9p8u404lPpJb0l7K+rLA8xxriGn/zVv2/T6nouEYOv/0WL2fX6AAHlj0gACTbSS1b6gAWGBsueTpZbrCrq7ZEvZ+ylDS3JWsuah1LxLUh25GnSBX35Wndh8TGuuFUFCuKjFdSMwCCV7eoACTb0XFgwDfj4srdJP2Ydvab8bDS9u1avqiTDhO3wRHsu06RMK64VR3YLRGYBw3IzeoAAAAAAB42opuTSS4tvqKvM6Q4GNwjN3z7K+K8+RvCuU3pFamkpxgtZPQtTC22umG/bZGuPxSeiOSy+k+ZdwojCiPd7T83+hT3XW3z37rJ2S7ZPVk2vh836b0Ic86K9FanW5fSfDp1VEZZEu72Y+b/AEKPM6QZ+Tqo2egh2V8H58yqBPrxKq/DX2kOzJsn46Hrbk25Ntvi2zwAkkcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHsZOMk4tprk0eAAusHpJmY2kb/9or+89JL5/qdFg7aws1qMLdyx/Ynwb8O04MES3Drs6royTXl2Q6Pqj6Ya7Ka7ffim+3rON2dt/Lw2o2Sd9S+zN8V4M6vA2ni7Qjrjz9pLVwlwkirtxrKevh5lnTkxs2ejNduDKPGt7y7HzIsoyhLSSafeXJ5KMZrSSTXec42tbk6NzW5TAn24MJca3uvsfFEOymyp+3F6dvUdozUtjvGyMtjAAG5uAAAAAACFmbNpym5/y7Pij1+KJoNoycXqjaM5QesWczlbOyMbWTjvwX2o/n2EQ7Eg5Wy6MhNxXo59seXzRLryvCZPrzPCZzgJOXg34j1nHWHVNciMTFJSWqJ0ZKS1QABk2NdtMLVpJcepogXUTpftcV1NFmeNJpprVMtMHiluI+XePl9CtzOHV5Pe2l5/UqAS78Rx1lXxXZ1kQ9njZVWTDnrf7e08nkY1mPPksQABJI4AAAAAAAAB9jAB8HLQAAAAAAAAAFJ0q2s9m7NcapJZF/sw7l1v8vmWuXlU4WNPIyJqFcFq3+S7z5dtXaNu1M+zKt4OXCMddVGK5Jf656npPs7wp5uR2ti7kN/W/BfX9zjdZyrRbkMAH1QggAAAzrg7JqMebMCwxKfRw3pL2pfREDiGYsSly8Xt7Sbg4jyrVHwW5urgq4KMeSMgD5/KTk3KW7PbxiopRWyAB7GMpyUYJyk+SRg2EYynJRgnKT5JF/s7ZscZKy3SVr5dkTLZuz44sVOxJ3Pr+HuJ5X3383djsVeRk83dhsAARSEAD2EJWSUYrVsARi5yUYrVvqLHGxo0relo59vYZY+PGmPbJ82biNOzXoiJZbzdFsAAcjiAAAAG9Fq+RR7S6SUY2teIlfZ8X2F+vy8zpXVOx6RRpOyNa1ky5ttrprdls4wgucpPRFDn9KKoJwwYOyXxzWkfkub+hzubnZGdbv5Fjlx4R+zHwRGLSnAjHrZ1ZW25spdIdCTl5+Vmy1yLpTXw8kvlyIwBPUVFaIhNtvVgAGTAAAAAAAANc76oPSU1r3cTpXVOx6Qi2/UEm9jYCLLNj9mDfjwNUsyx8t2PyLKrg2XZvHT2s6KqTJ4bUebS8SsldZLnOXmYFhX9npfjs+C/8N1T5ss3dWudkfMxeVSvt/RlaCVH7P0L0pN/D6G3YosHmVfefyPPXa+qMiADuuB4i8H8TPZRJrzY9UH5nnr3939SGDouDYS/B839TPZR8iZ69/d/5h69/d/5iGDP9HwvyfN/UdlDyJnr393/AJh69/d/5iGB/R8L8nzf1HZQ8iZ69/d/5j1Zy64PzIQMPg2E/wAHzf1HZR8ies2vrUl8jNZVL+3p4orQcJcBxZbar3/sY7GJbRnCXuyi/BnpUGcbJw92bXzIdn2e/wCuz4r+foaOnyZaAgRzLVz0l4o3QzYP3ouP1Ky7g+XV15dfZ/NTR1SRJMoTlXNThJxlF6pp6NGEJxmtYyT8D0rJRcXyyWjOex0eyuksobtOf7UeStXNeK6/9czpqra76o2VTU4S4qSeqZ82JOHn5ODPex7XDXnHmn4orr8GM+sOj+RNpzJR6T6o+hgptmdIcfMarvSot6tX7MvB9XgXJU2VyrekkWcLIzWsWR7cOufGPsPu5eRDuxrKuLWse1FoDMbJIkRtlEpQWduLVZq9N2XaiFdi2VcdN6PajtGxSJEbYyNIAOh0AAAAAAPGk1o1qmVWbseMtbMXSL+Dqfh2FsDeFkoPVHSuyVb1izkLISrm4Ti4yXNMxOpy8OrLhpZH2lykuaOey8K3ElpYtYvlJcmWFV6n08S0pyI2dNmRwAdySCPkYys9qPCf4kgHbHyLMeasrejON9EL4OFi1RUNOLaa0aPCyyMdWrVcJrkyvlGUJOMlo0e5wOIV5kOnSS3X88DxubgzxZdesXszEAFiQQAAAAAD7GAD4OWgAAAAAAMLra6Kp23TUK4LWUm+CR7ZZCquVlk4whFaylJ6JI+e9JukMtq2+r4zccOD4dTsfa+7sX+lbcJ4VbxG7kj0it35fv5HOyagjV0k25LbGSo1pxxqm9xPnJ/EylAPrWNjVYtUaalpFECUnJ6sAAkGAAepNtJcWzDenVmUtTfiVeks3mvZj9SwNdNaqrUevrNh4HiWZ96vcl6K6L+es9tw/F+7UqL3fV/z1AAFcTz1JtpJNt8ki/2Xs9Y0PS2rW2S/wow2Ts/0UVfdH+I/dT+yv1LQgX3a92JWZORzdyOwABEIIAM6apXT3Y/N9hhvQN6dWeV1ysmoxWrZZ0URpjouLfNntNMaY6R59b7TYRp2c3REOyzm6LYAA5nIA0ZOZjYkd7IuhXw10b4vwXNlLmdKqoaxw6XY/jnwXlzf0OtdFlnoo5TuhX6TOhb0Wr5FRndIsLFTjVL1ixdUHw8/01OWzdp5mc36e5uHwLhHyIZY1cPS62Mg2ZzfSCJ+0Nr5e0G1bPdr6q4cI/PtIABYRjGC0itCBKTk9ZMAA2MAAAABtRWraS7zTPKqjye8+47VY9tz0ri2ZUW9jcCFPNk/cil48TROyc/ek2W9HAcifWxqPzf8950VMnuWE8iuHBy1fYiPPNb4Qjp3siAuqOCY1XWXefr+h1VUUZzsnZ70mzAAt4QjBcsVojrpoAAbAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9TaeqbT7jfXl2R972l3kcHC7GqvWlkUzDinuWVeTXZ17r7GbSoN9WTZXw13o9jPPZfAfxY79z/wBP6/E4Sp/KWBc7K2/fhaVX63Ud71lFd36FDVkQt4J6S7GbTzOTiuL7O6OhzjKdctV0Z9Dws/Gz69/HsUtPei+Dj4oknzem6yixWUzlCa5Si9GdTsjpHXkaU5u7XZyVnKMvHsf0KS/ClDvQ6os6cuM+k+jL8AEAmmi7Ert46bsu1EK7Fsq4tb0e1FoDeNjR0jbKJSgs7sSu3jpuy7UQ7cS2vilvLtR3jYmSY2xkaAAdDoAAADCyuFsHCyKlF80zMAzsc5tHZ8sSW/DWVT6+zuZBOwlFSi4ySafBp9ZRbR2X6BO2jWVf2o83H9ifTfzd2W5ZY+Tzd2e5WAAlk4Gq+hXR7JLkzaDpVbOmanB6NHO2qNsHCa1TKiUXGTjJaNHhY5NCtjrH319SvaaejWjPe4GdDMr5l0kt1/PA8Vm4csWzR7PZngAJ5CAAAPsYAPg5aAArs7buzdn3OnJyVG1c4KLk15LgdaaLb5clUXJ+SWphtLcsSNn5+Ns7GlflWKEFyXXJ9iXWzl9o9N1o4bOx3r/zLfyiv1+Ry2bnZW0LvTZd0rZ8uPBLwS4I9Rw77K5N0lLJ7kfLxf09/wADhO9L0Sw250iydryda/hYqfCtPn3yfWUwB9DxsarFrVVMdIoiOTk9WAASDAAAAJeFVq/SSXLkR64OyaiustIRUIqMVokUPG8zsquxi+sv0/f6l1wfE7WztZbR/X9j0AHjT1gLfZGz97TJuj3wi+vvNGy8B5NnpLF/Ci/8T7DoCHkXadyJAyr9O5E9ABBK0AG3HoldPTlFc2Yb06sw2ktWeUUSulouEet9haV1xqhuwWiEIRhFRitEjIizm5EOyxz9gBqycmnFpduRYq4LrZzO0uk1ljdeCvRw/wCZJe0/BdX+uRvVRO191EW26FS7zOgztpYuz4a5FmkmtVBcZP5HM5/SXKyG4YyWPX2rjJ/Pq+RTTnKybnOTlKT1bb1bMS2pwq6+surKy3LnPouiMpzlZNzsk5SfFyk9WzEAmEUAAAABtRWraS7zKTb0QAI1mZCPCC3n29RGsvss5y0XYi3xuDZN3WS5V69/h/4dI1SZOsvrr5y1fYiNZmTlwgt1dvWRQegxuDY1PWS5n69vh/6do1RRlKUpvWTbfeYgFuoqK0R1AAMgAAAAAAAAAA9Sb5GSrm/ss1lOMfSehtGEpbIwBsVM32IyVD65fQ4vKpW8jqsa1/hNIJCoj1tnvoYd5yedUjosO1kYEn0UOz6nvo4fCjR8Qr8mbrBs80RQS/Rw+FDcj8K8jH9Qh5Mz9xl5kQEvcj8K8huR+FeRj+oR/KZ+4S8yICXuR+FeR464P7KMriEPFMw8Gfg0RQSXTDs0+Zi6F1NnRZ1T36HN4VqNANzofU0zB1TXV5HaORVLaRylRZHeJgD1rTmeHY4gAGQAAAem+nKlDRT9qP1RHBwvx6siPJYtUYcVLoy2hONkd6L1R6Vddkq5axehPoyI2rTlLsPH8Q4TZjazh1h817fqRZ1uPVHQbH2/ZhtU5TlbRyT11cPDtXcddVbXfVGyqanCS1Ul1nzYnbM2pfs25Sre9W37VbfCX6PvPL5OGp96HRkmjLcO7PY74EXAz6NoUeloly96L5xfeSinlFxejLVNSWqAAMGTTfjQu4+7LtRX3UTpftLh1PtLY8aUk00mn1M6RscTrC1xKYEy/Ca9qnivhIbWj0fMkRkpbEqMlJdAADY2B4egApdp7M01uxo8PtQXV3oqDsSl2ts/d1yKVw5ziurvJtF/4ZFjjZOvcmVAAJpYA0ZNHpY70V7a+pvB2ovnj2Kyt9UcbqYXwcJroyoPCdl4+8nZBcVzXaQT32HmQy6uePvXkeJy8WeNZyS9z8wACYRT7GCsu6Q7JoipTz6mn8D335LUqNo9NcapShgVSvn1Tmt2Hjpzf0PjOPwjOyJaQqfta0XxfQsXZFbst9vbXhsjAlb7Er5cKq5P3n2+C5/TrPmV1s77p22y3rLJOUn2t8WbMzMyM6935VsrbHw1fZ2JdRoPpfBeER4bU03rN7v/AEvV+pDss52AAXZyAAAAAAABtor9Lao9XN+BzssjVBzlsjeuErJqEd2SsOrchvvnL8CSAfOsnIlkWytl4nvMeiNFarj4AkYWJPLvUIpqK4yl2I011ytmoQi5Sk9EkdPhYscShVx4yfGUu1kG63s103Nci7s49N2baq4U1xrrioxitEjMArNyob1ABsopldPRclzfYYb06sw2ktWe49Er5aLhFc2WdcI1wUYLRIQhGEVGK0SMiLObkQrLHN+oFTtbblGz06q9LcjT3U+EfH9PwIG2+kOm9jYE+PKVq/8A8/r5HMttvV8WT8bC5u9Zt5FXfl8vdr+Jvy8zIzbfSZFkpvqT5LwXURwC1SSWiKxtt6sAAyAAOQAPJSjBayaS7zRdlxjwh7T7eohzslZLWT1LvD4Ndf3rO7H5nWNTe5JtzOqpfNkWc5TespNsxB6rGwqMZf249fPx+JIjBR2AAJZsAAAAAAAZKLlyWpnGhvm9DlO6uv0mdIVTn6KNR6SFTBdWviZpJckkQ58QgvRWpLjgyfpPQjKub+yzNUPraRuBGln2vboSI4Va36mtUxXNtmSrgvsoyBGlfZLeTJEaa47IAA5HQAAAAAAAAAAAAAAAAAAAAAAAANJ81qYOqD6tPAzBvCycPRehrKuM/SWpolTJcuJr5cyWeSipLiidVnyXSa1IVmDF9YPQiA3Tpa4x49xqLKu2Fi1iyvsqnW9JI8AB1OYPU3Fpp6NHgMNJrRgscfIVq3ZcJr6m4qU2nqno0T8fJVmkZcJ/ieQ4pwl0t20ru+K8v2/QjWV6dUTsTKuw7ldj2OE1w7muxnabJ2vTtKpLVQvS9qvX6rtRwhlCcq5xnCTjKL1TT0aPLZGNG5eszRkSqfqPpQKPYm3lmNUZW7C/7MlwU/3Lwo7K5Vy5ZFzXZGxc0QADQ3BoyMaNy1WkZ9vabwZTaeqMptPVFPZXKubjNaMxLa2mF0dJLwfWitvonTL2uK6mSYWKRLrsUuniawAdDqDw9ABQbWwFjy9NTF+jlzXwv9CtOvnGM4uMknFrRpnNbQw5Yd+7zhLjF9xYY93MuV7lpi3865JbkUAEomgr8qn0c95L2ZfQsDGyCsg4y5MsOHZrxLub8L3/AJ6iDn4iyquXxWxUgzsrdc3GXV9TA99CcZxUovVM8TKLhJxkuqAANjUAAAAAAAAAAAAFhh1blW8+cuPyIdFfpbVHq5vwLQ81x7L5YrHi9+r9ngeg4Ljayd8vDov9gAnbKw/Wsjemv4UOL732HkpSUVqz0c5qEXJlhsfC9FX6exfxJr2e5FmeHpUzm5y1ZSWTc5czABlVVK2ajFfsabGjeh7TVK6ajH5vsLSquNUFGK4fieU1Rphux+b7TYRpz5iHZZzPpsDlekG3PS72Hhz/AIfKyxfa7l3fj+MvpJtb1eDw6GvSzX8SXwrs8WckWGHja/3J+4qcvI0/tx94ABaFaAAAAOXMi35ej3auP3iVi4luVPlrX0RmMXJ9DdbdCpe0+PYiFdkTt4PhHsRqbbererPD2OFwqnF0k+9Lz+hKhWogAFqdAAAAAZxrlLkuHazWU4wWsnobRjKT0ijA9Sb5LU3xpiufE2JJLRECzPiukFqTa8GT6zehojTJ83obI1Qj1a+JmCBZlWz3fwJsMauGyAAI53AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABjOCmuPPtMgbRk4PWLMSipLRkWcHB8fMxJjSa0fIj2VuHei4xstWd2W/6lTkYrr70djWACcQwengAJ+Nkb63Jv2up9pIKlPR6om4+UpaQsfHqfaeT4pwlwbuoXTxXl7PUR7K/FEo6bYnSBtxx8+a7IWv8JfqcwDy1tMbY6SNKrZVS1ifTAcZsfb1mClTkKVtHVx9qHh3dx19F9WTUraLIzg+TTKO7HnS+uxc03xtXTc2AA4HYHk4RnFxktUz0AFZk4zpe9HjD8DQXLSaaa1TK/KxfRe3DVw/AkV2a9GSq7dejIwAOx3BGzsVZeNKvgpLjFvqZJBlNxeqNoycXqjj5RcJOMlo09Gjwttt4m7NZMFwlwn49TKktq5qcdUXdVisipIAA3Ohoy6vSV6pe1Eri4K3Jr9Hc+x8Uep4Dltp48vDqv8AaPN8axUtL4+x/wCjSAD0550AAAAAAAAAAGdcHZZGK6zWclCLlLZG0YuUlFbsmYVe7XvtcZfgSTxJJJLgkenznKveRdK1+J73GpVFUa14GdVcrrY1wWspPRHUYuPDFojVDq5vtfaV+xcNRh6zNe0+EO5dpbFPk2cz5VsiFl280uRbIAAikI9hBzmoxWrZa0Uxphurm+b7TVhUqFe+/el9ESSNZPV6IiW2avRAibUzo7PwZ3vRy5QT65dRLOI6Q5/ru0JRhLWmn2Y6cm+tnTGp7Wej2RByLeyhqtyttsndbKyx705ttvtZgAX+xSAAAANpLVvRIEDJyPSPdi/YX1J2DhTy7OWOy3fkbQg5MZGQ7G4x4Q/EjgHvKKK8eCrrWiJiSS0QAB2MgAAAyjBzeiM66nLjLgjekktEtCBkZka+7DqybRiOfel0RhCqMefFmYBUzslY9ZPUtIQjBaRQABobAAAAAAAAAAHqTbSS1b5JFhj7D2lkcY4s4rts9n8TDkluG0iuB0lHRG5v/aMquC7K05a+ehZ4/RjZ1PGcbLn9+XD6aHJ3wRo5xRxBKp2dm36eixbpKXJqD08+R9AoxMfH/kUVV98IJG44vJ8kau3yOHp6M7TsftVwqXbOa/LUl1dEb3/Oyq4f0Rcvx0OtBo8ibNe0ZztXRHHX83Ktl/SlH9SRX0X2dD3lbZ/VP9NC6Bo7ZvxMc8vMq10d2Un/ALr52S/Uz/sLZmuvqkPN/qWINeeXmY5n5kFbG2clp6nV5Hv9j7O009Tp/wAJNA55eY1ZEWytnxWiwsf51pj+y8D/AKLH/wD1olgxzPzMasiS2Vs+S0eFR8q0jVZsPZli9rEgv6W4/gWAM88vMzqyon0a2ZJaRpnDvjN/mRbeiOK4/wAHJuhLtmlJfkdCDZWzXiOZ+Zx2R0UzK+NFtdy7/Zf+vmVuRsnaGN/NxLUu2K3l5o+hg6LIktzdWM+Xg+jZWzcPM19Yx4Sk/taaS81xKDaHRRpOeBZvf3dj4/J/r5naORF79DdWJnMA25GPdjWuu+uVc11SWhqO5uAAZADSa0fIAJ6DcjWQcH3dRgS5RUo6MjSi4y0ZeYmR2seWW6KfJo7N6rZmIAJhEAAAJmLkcq5vwZLKgnYmRv8A8OfvdT7Ty3F+Gaa5FK9q/wB/Uj21/iRJJmztpZGzrt+lpxfvQlykQweXlFSWj2OMZOL1R9A2btGjaNCsqekl78G+MX+neTD5xj5FuLdG2ibhOPJo7bY+1qtp09UL4r24fmu4pcnEdXejt+hbY+SrO7LcsQAQiYA1qtHyAAK3Lx/RS3or2H9COXFkFZBxlyZVXVOqxwl8n2kmueq0ZLqs5lo9zAAHU7Gu6qN9Uq5rWMlozlbqpUXTqn70XodcU23cf3MiK+7L8v8AXgSsaekuV+JNxLOWXK/EpwAWBaAjZte9UprnEknkkpRafJ8CRi3vHujavB/+nDJpV9Uq34lQAD6QeAAAAAAAAAABNwa9Iux9fBESEXOaiubLWMVGKiuSWhQcdyuzqVMd5b+z9/qXfBsbntdsto/qem7Ex3k5MKlyb4vsXWaS92HjqFEr2vam9F4L9/wPE2z5Ianpb7Ozg2WUYqEVGK0ilol2GQBVFIDZjVeluUXy5vwNZY4Ne5TvvnP8DScuVGlkuWJJABEIJXbezng7NnKD0ts9iHdrzfyX5HCF70syvS58MdcqY8fF8fw0KIvcKvkqT8WU2XZz2aeQABLIoANd9qqr163wSOlVcrZqEFq2EtXojTmXaL0cXxfMhHrbbbb1bPD6BhYkcWpVx38X5smxjyrQAAmGwAPYpyeiRhtJasyk29EOZvrq04y59h7XWoLtfaZlRk5jl3a9i0x8RR709wACvJwAAAAAAAAABY7P2Lm5+kq69yp/+5ZwXy7TqNn9HcLDSlZH1i34prgvBHKd0YGrmkcnhbJzc7jRS9z45cI+fX8joMLonTBKWba7JdcIcI+fN/Q6MEWV8pbdDk7GyPi4WLhx3caiFfDRtLi/F82SADg3ruaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGnLxKMyl1ZFcZx7+rvXYcjtXo5fh624u9fT2Jazj4rrO0B0hZKGxtGTR8vB3W1tg4+0VKyGlOQ/tpcH4r8zjs3CyMC51ZFbi+p9Uu9PrJtdsZ7HaMlIjAA6mwMbIb8e9cjIG0JuElKO5rOKmuVkTkeG+6H2l8zQegptVsOZFHbU6pcrAAOxyB6no9VzPAYBZY9ythx95czaVVc3XNSjzRZ12KyClH/weK4tw/wC7T7SHoP5Py+hFshyvVbGRspusx7oW1ScZweqaNYKVrXozknod3sfate06OOkL4e/D813FifOcTJsw8mF9L0lB69z7md7s/Nr2hiQvr4a8JR1919aKTLxuyfNHZlxjZHaLlluSQAQiWDRlU+mq4e9HijeDKej1RlNp6opQSs6jcl6SK9l8/EikuL5lqT4yUlqga8imN9E6pcpLTwNgNk9OqNk2nqjj5wlCbhJaSi9Gjws9uUejyY3JcLFx8UVhbwlzxUi8rnzxUgADc6FOAD6gfOQAAAAAAAexi5SSXNmG0lqzKTb0RLwauLsfgiYY1wVcFFckZHzzOyXk3ys8PD2HusPHWPSq/Hx9plVXK22Ncfek9EdZVWqqoVx5RSSKTYdG/kSua4Vrh4svijyp6y5fIjZk9ZcvkAARSEe1wc5xiubehcJKKSS0SIGBXvWOb5RXDxLAjWvV6EW+Wr0ABpzLvV8O67XTcg5Lx0OaWr0RHb0Wpwe0rvWNo5Fu85KVj0fdrw+hFPTw9NFcqSR55vV6gAGTAbSTb5IrL7XbY5PlyRvzLtX6OPJcyIew4LgdlDt5rq9vUv3JNUNFqwAD0B2ABsrrc+L4I0nZGuPNJm8ISm+WJjCDm9F5kmEFBaI9SSWi5ApMjKld0XRFvRjRq6vqwACKSQAAAAAADfiYd+bcqsetzl16cl3t9R1mzOjOPjbtmXpfb8OnsL5dfzOc7Iw3NZSSOd2fsXM2g04V7lT/APcnwXy7TqNn9HMLE0lZH1i1famuHyX66luCHO6UvUcnNsAA4mgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANGbh0Z2O6ciG9F8V2p9qN4CenVA4Da2ybtl2pT9uqT9ixLn3PsZXH0vJx6suiVN8FOEuaZwO1NnW7Ny3VYtYPjXPqkv1J9NvP0e53hPXoyEADubgjWQ3Jdz5Ek8lFSjoyTjXumWvgzhkUq2PrIgMpRcZaMxL5NNaopGmnowADJgG7Hu9FPj7r5mkHK6qF0HXNapmGk1oy3TTWq5MEPDu0fo5Pg+RMPn+ZiSxbXXL3PzRDlHlegLLYe0ns/NTm/4FnCxdnY/kVoIU4KcXF7MQk4SUkfS000mnqnyaPSi6LZ7vxZYtktbKfd164ft+hennba3XNxZe1zVkVJAAHM6GM4KcHGXJlTbW6rHB9RcEbOp36t9L2o/gdK5aPQ7VT5XoVwAJRLIm06PT4Ni+1Fby+RzJ2ByuXT6vlWVdUXw8Oom4sujiWOFPo4GkAE0sCnAB9QPnIAAAAAAJeDXq3Y+rgiKlq9EWlUFXXGK6kUnG8rsaOzjvL9PEuOD4/a3c72j+vgZgHsYuclGPNvRHij1x0WyKvRYEHpo5tyf5fQnGMIKEIwitFFaIyKecuaTZQzlzScgAbMeHpL4R6tdWaN6LU0b0WpY41foqIp83xZtAITer1K9vV6gqOlF3otkSguds1H8/wAi3OW6YXt5GPR1Rg5vv1en5fUkYsOa6JGyZctTOcAB6ApAasm70UOHvPkbW1FNvkuJWXWO2xyfDsXYW/CcH7zbzTXdjv6/UdK4czMDwA9ySwAbaq972ny/E52WRrjzSN665WS5YiqvX2pcjeAUN10rpasu6qY1R0QABxOoAAAAJez9nZG0b/R0R4L3pv3Y+LMNpLVjYixTlJRim23okus6HZnRey6Mbc6Tqi+Po4+98+wvNl7FxtmreivSXPnZJcvDsLIiWZDfSJxlZ5GnFxaMSpVY9Ua4LqXX49puAIrepzAAAAAAAAAAAAAMbLIVQc7JxhFc5SeiRWZPSPZWO2nlxnJdVactfmuBvCqdnoJs1clHdlqDlMnprWuGLhyl32y0+i1/EqcjpVtW9+zbClNaaVwX4vVk+vhWRPdae04yyII+gke7Pw6Jbt2XRXLslYkz5nfnZeTHdvyrrY9k5tryI5NhwX88/gjk8ryR9Hs6SbIrbTzFJ/dhJ/VIhT6ZbOi2o1ZMtOT3Uk/qcKCTHhGOt9WaPJmdjZ02rT/h4M5L71iX5M1vpu+rZ6//AHf/AMnJA7LhmKvw/N/U07ezzOsl02s+zgxXjbr+Rj/62v3f9yr17d9nKgz/AE7F/J839R29nmdR/wCtcn/pKf8AEzFdNMzrxqPr+pzINv6fjfkMdtZ5nUR6a5Sa3sSlrr0bRuj03+LZ/ld//JyINXw7Ff4Pm/qZ7ezzO5q6Z4EmlZRfDXrSTS+pY4239l5KW5l1xb6rPYf1PmoOE+EUS9HVG6yZrc+tpqS1TTXaj0+WYefl4M97FvnU+eifB+K5M6rZPS+u1xq2jFVS5elj7r8V1f65FZkcKtqXNDvL5/A7wyIy6PodSDGE4WQjOuUZwktVKL1TRkVRIAABkAAAEHbGzobSwpVNJWx41yfU/wBCcDKbT1QT0PmM4yhOUJpxlF6NPqZiXvSzCdG0FkxXsXrj3SXP8n5lEWcJc0UySnqtQADYyY2Q34965EYlmi+Gj3lyZZYN+j7OXuK/Mp1XaL3moAFsVgAAB7yLHGt9LXq/eXBlabce30Vib918GVfFcP7zQ+Vd5dV9Pec7I8yLIAHgyIS9l5bwtoU36+ypaT/pfM+gJppNPVPk0fNDvdhZHrOyaJt6yjHcfy4FZxCvop+4scGfVwJ4AKosgOa0YABUX1+itlDqXLwMCbtCHCNnyZCJkHqtSdCXNHUFHt6rS6u1faW6+HZ/5+heFftqvfwHL4JKX5fmSKJctiJWPLlsRzwALQuinAB9QPnIAAAAABvxIb961+zxLEiYEeE5fIlnh+N29pluPhFJf7PY8Iq5MZPz6gl7Lr9JtCpNapPe8uJELXYFet9tnwxS8/8AwUdr5YNk++XLW2XgAKkpAS9nR1nOXYtCIWOBHTH1+JtnOx6ROVz0iSQARSGDg9vXen2xkyXKMtxfLh+R3c5xhCU5PSMVq33Hzac3ZOU5PWUnq33llw6PelIr86XdUTEAxsmq4OUuouIxc5KMVq2Vm5Gzbf8A24vvZDPZScpOT5t6nh9DwsWOLSq17/aTYR5VoAD2KcpJLrJTaS1Zuk29EZVw333Ik8jyMVGOiPSgyb3dL1F3j0qqPrAAI53AAAAN+Jh5GbcqsaqU5denJeL6jr9kdHqMHS3I3b7+a1Xsw8P1Oc7Yw3NZSUSn2T0buyt23L1pp5qP2pfoddj49WLTGmiChXHkkbAQJ2SnucJScgADQwAAAAAAAAAAV20tt4OzE1fbvW/8qHGX7fM5LafSrNzFKuj/AGap/A/afz/Qm4+Bdf1S0XmzjO6MNzrto7awNm6rIuTsS/lw4y/b56HM5/THKtbjhVxoh1Skt6X6L6nNNtvV8WeF9RwuirrLvP1/QiTyJy26G7Iyb8qzfyLp2y7Zyb0NIBZJJLREfcAuti9Hcjan8WbdGP8AG48ZeC/M67C6P7MwktzGjZNfbt9p+PHgvkV+TxKmh8u79R3hRKfU+eU49170ppssf3It/gbnsvaCWrwcpL/4ZfofUIxUYqMUklwSXUelc+NS16Q+Z2WKvM+SNOLaaaa4NM8Pq+RjUZUNzIprtiuKU4p6HPbR6H41sHLAm6bOqE3vRfz5r6kqni9U3pYuX5o0ljSW3U4kG7JxrsS6VORVKuyPOMl/rVGkt001qiLsAAZAAAAAAAAAAAABZbK23mbLmvRTc6euqbe7z6uxncbI23i7Wr/hPcuUdZ1S5rw7V/rgfNTZRdZj3Qupm4WQesZLqZX5fD68harpLz+p2rulDp4H1gFT0f21Ha2M1NKORXpvx7e9FseUtqlVNwmuqLGMlJaoAA0NgAACr6SYvrOx7dFrKr+IuPZz+mpwZ9PnCNkJQmtYyWjXaj5tl48sTKtx5+9XJx10595MxpdHE7VvwNIAJR0B5KO9FrtPQZTaeqDSa0ZEfB6HhtvjpLXtNR6OqxWQUl4lBZB1zcWAAdDmAAAWOJZv0pN8Y8GbivxJ7lyXVLgWB4Pi2N2GS9Nn1X89pDsjpIHW9ELU8K+rrjZvea/Y5I6TodLSzLh2qL8tf1KHNWtLO2I9LUdQAChLoAAAwuh6SqUO1cCoLoqsmG5kTXVrqjvS/AkUPdGo1ZVfpcW2CSblBpa9uhtBIT0epKT0epxwNmRBVZFla5Rk0vM1lwnqtS/T1WpTgA+onzoAAAAAAsMJaUa9rbJBHwnrR4Nkg+ecQ1+9Wa+bPd4On3aGnkgXuwYpYtkutz0+i/Uojo9jxS2dB9rb+pU5L0gMx6Vk4AFcVILbHSjj1pfDqVJcpaJJdRwufREe99Ej0AHAjEXak9zZeVL+6l+B89O829/wbJ1+Ffijgy34eu436yqzn30vUCHnWayVa6uLJjaSbfJFVOTnNyfWz1/AsbtL3a9o/qyNTHV6mIAPZEoEiiOkd582aYrekl2krkV2fbyxUF4k/Cr1k5vwAAKgtAAb8TEuzciNOPBym/JLtfcYb0BpSbaSWrfJI6DZXRmy/S3P3qq+arXvPx7PxLrZGw6NnRU5pW5PXNr3e5FqRLMjwicpWeRpxsWjEpVWPXGuC6l/ribgCLrqcgAAAAAAAAADGyyFUHOycYRXNyeiRQbR6Rpb1eCtXy9LJfgv1NJTUdzjbdCpayZb520cbAhvXT9prhCPGT+RyW1Nv7SzG4Yy9Vq+7L2n8+r5EOc52Tc7JSnJ85SerZia1ZrqlzKKft6/7KqzOnP0eiK94tzerWr8R6pd8K8ywBYf17K8o/B/Uj9tIr/VLexeZ76pb3eZPBj+vZXkvh+47aRA9Ut7vMsdhbFln7QjC5fwILes0fV1L5v8zE7Ho9i+r7NjNx0nd7b8Or6cfmbR41lWd3p8P3JOLzW2aPYsq4RrrjXXFRhFJRiuSSMgCGXIAAMgAAEDa+yaNrY3orVu2R412JcYv813HObP6G2ze9n3KuKbW5XxbXbryXk/kdkCXTm3UwcIPp/NjlKqEnq0VuPsDZePHSGFVLtdi3/xJP8AZ+F6L0XqmP6P4fRx08tCSDhK6yT1cn8TdRitkVeX0e2XlR0liwrejSlUtxry4P5nM7X6KZGFW7sSUsmvXjBR9uK6vH5eR3QJNGffS+j1XkznOmEvA+S7kvhfkN2S6n5Hdbf2OpxlmY0dJrjZBL3u9d/b/rXmiTLj84vR1/P9ipucqpcskVOj7GeFuDC+0T/6/n+xy7f1FQC3Gi7Ebf8A6Jf9fz/Yz2/qKgFtux7F5Dcj8K8jK+0MfGv5/sO39Q6M5TxNuY71aja/RSXbry+uh9GPnMYRjJSjFJp6ppcjv8LIWVh1XrT24pvTqfWvMgZWbDMs5ox06FhhXKesTeACMWAAAAOQ6X4no8uvKiuFq3Zf1L9tPI68r9u4fruyrq4rWcVvw4a8V+q1XzOlUuWaZtB6M+fgAsiQAAAY2x3oPu4kUmEWyO7NoteH2dHB+0rc6vaaMQAWZXAAAHqej1XNFrXLfrjLtRUk/CnrU49cWUHHqOehWreL+T/fQ43LVakg6LofLTJyI6c4J6+D/c506Dog367eur0f5o8Nl/4ZGuN/lidYADz5eAAAAgbRjpZCXatCeRdoLWmL61I3rekjpU9JorwASyac5tiDhtCb6pJNeWn5EEtdvw0uqn8UWvJ/uVRa0vWtF3Q9a4sjepV/FPzR76nV2y8zeC0fEst/8jPmXaS8zR6nV97zPViUr7LfzNwNHn5T/wCR/Ec8vM1eq0/B9WPVqfgXmbQavMyX/wAkvizHNLzPIQjBaRWiMgCNKTk9ZPVnvOCWqzDiteq1Xz1/Rg6TZH/Davn+LObOk2R/w2r5/iyJlegvaTM3/GvaTQAV5VGVS1ugu2SLgqKP59f9S/EtyPduiNfugADiRyt6QvTYmT4R/wC5HCnc9JGlsTI46a7qX+JHDFzw/wDxP2/Qqc7/ACL2GnLlu0Pv4FcTc9+zCPa9SEfRuB18mIpebb/1/o0qXdAALk6m6iPFy7DcYUrStd5mefyp89r9XQvMaHLUgAbKabL7Y1VQc5yeiiusjnc3bPwbdoZcaKuGvvSa4RXazvNn7Po2djqqiPH7U3zk+81bI2ZXszF3I6Stlo7J9r/QnlfdbzvRbHCctQADiaAAAAAAAA8lJRi5SaUVxbb4IGD0r9p7Xo2fHd/mXPlWny8ewrNqdIdd6nB4Lk7f0/U55tybcm23xbfWR53adIldkZqj3a9/MkZudkZ1m/fY2uqK4RXgiMARm9dyqlJyerAAMGAAAAAADZRU7r66k9HOSjr4vQ+gQioQUYrSMVokcXsKCntjHUkmtW/mk2dqSqF0bLbh8e65AAEgsgAAAAAAAAAAAAAAAcZt3BjhZz9GtKrFvRXUu1f67Tsyo6S46u2b6VL2qZJ69ej4P8vI5Wx1iRMyvnqb8UciACEUQAAAAAAOm6K5W9VbiyfGD34+D5/X8TmSZsrL9T2hVa3pDXdn/S+f6/I3rlyy1O+PZ2diZ3IAJ56EAAAAAA+d7WxfU9p30paRUtYL7r4ohnSdMqFHJx71znBwfDsev5/Q5ssq5c0UyTF6oAA6GQachcpfI3GNq1rZ3xp8lqZxyIc9bRFAB6EogAAAb8SW7eu/gaD1NpprmjjkVK6qVb8UYktVoWxfdEH/APkbl21N/VFBGSlFSXJrUvuiP/E7f/hf/dE+XZaaqkmcMf8AyxOvAB54vAAAAaMxa40/l+JvNWT/ALvZ4GY7o2j6SKoAE0nlTt+GtNU+yTXn/wCCkL/bq1wovssX4MoCyxn/AGy3xH/aR4ACQfNAAAAAAD0Hh6Cx4dxCeFZqusXuv54g6DYcnLBaf2ZtL6P8zny42BZ/OrcuySX4/kR8la1s9VLiWNk16Ql18nuXIAK04GdH8+v+pfiW5TRluyUl1PUuE00muKZHu8CNeuqPQAcSOV+3q5W7GyYwWrUVL5Jpv6I4M+lySlFxkk01o0+s4Ha2BPZ+bOpr2H7Vb111jrw+Za8PsWjh7ytzq3qplLnP+LFfdIpIzdfT8exaEc+q8Njy4la9Ryh6KAAJxuS4e5HwPQuCB5iT1k2eiitEkDq+iWzUq3n2xTlLWNXcuTf5efactCMpzjCK1lJ6Jd59LoqjRRXTD3a4qK17EtCLkT0jovE0sei0MwAQjiAAAAAAAY2WQqg52TjCK5uT0Rz20OkjesMFadtkl+C/U0lNR3ONt0KlrJlxtDaOPs+vW6Ws2vZgubOT2htXJz5aTluVdVceXz7SHOc7JudkpTk+cpPVsxIs7XIp78qdvRdEAAciKAAAAAAAAAAAAWXR/wD4zj//AG/7WdmcXsB6bZx//t/2s7Ql0eiXPD/8T9v0AAO5PAAAAAAAAAAAAAAABpy6/TYl1XxwlHzRuBgw1qtD50DKa3ZuOuuj0MSuPMAAAAAAAAAHcbHyfWtm02N6yS3ZeK4fuTSh6KW6419WnuzUtfFafkXxPg9YpnocefPVFgAG53AAAKPpbU7NkqcUv4dik33cV+LRxZ9H2lj+t7OyKEk5Tg91Pt6vrofOCbjPWOh2rfQAAknQAAAiSWkmuw8Nly0s8TWekqnzwUvM8/ZHkm4gAHQ0AAALDDnvUafC9DoOir02vz01rl8+RzODLSco9q1Oi6NPTbdK7VJf5WfO+O09ldals+vx6/qcILlvXtO3AB4suwAAAasn/d7PA2mnLemNP/XWZjujaPpIqwATSeQdsLXZ1j7Gn9TnDp9pR39n3L7uvlxOYLDFfcZaYT7jXrPAASj5uAAAAAAAAADfh5DxcmFq4pPiu1dZoBhpNaMzGTi1Jbo6+qyFtcbK5KUZLVNGZzGDtC3DlovbrfODf4dheY+0cbIXs2KEvhnwf7lbZRKD6bHpsbNruWjekvL6EssMG5Sh6N+9Hl3orjVbm0Yz3p3RjJdSfHyI8oc60RJt5eXvPQ6AFBi9KMac9zIhOtdVmmq+aXL5alzTl41+qpyKrGuajNPQjzpsr9JFdG2E/RZuIu0Nn4+0aVXfF8HrGUeEo+Btuysej+dfVX/XNIpdo9J6K4uGEnbZ8clpFfmzNVdkpJwRrbZXGOk2cl0h2Xbs3JjGyUZRfutNcV1PTmv2Kgucqc8yc55EnOc3q5PmVNtUqpaSXg+0+o8CzOehUWPvR+a/YrYTi+iMAAehOhLg9YJ9x6aaZ6ey+vkbjz2RU67Gi9osVkEyRs+ShtHGk1qlbFvzR9IPl59G2ZlrN2fTfqnKUVvacPaXP6lbkrZmbF4koAEQ5AAAAibR2hTs+nft4yfuwXORuyb4Y2PZdY/ZhHV9/ccLl5NuXkSutlrKT8l2I5WWcq6bkPKyOxWi3Ztz9oX59m9dL2V7sFyiRACG231ZSSk5PVgAGDAAAAAAAAAAAAAAABL2VPc2pjP+8S8+B3R8+osdN9dq5wkpeTPoJKofRotuHPuyQABILIAAAAAAAAAAAAAAAAAA+eWS3rJS56tsxAK08uAAAAAAAAAXPRi/0e0nW29LYNJd64/hqdYcDh3vFy6r1r7Ek3p1rrXkd8mmk09UyXQ9Y6FxgT1g4+QAB3LAAAAHz7bWP6rtbJr00TnvR8Hx/M+gnJdMqXHLx7+qcHDyev5nfHlpPQ3rfU5wAE87gAAGrIXBM0Eq1a1sil3gy1q08iozY6Wa+YABNIYAABtx5bt8H36HS9HWltvG1+9/2s5ZPRprqOl2E09sYrb0W9+R4/7T19FPzTXw/wDTm+lkX6zvQAfNy4AAABozXpjS79PxN5F2g/4C/qNoekjeHpIrwATCcaM3/cr/AP45fgcqdbfHfx7I6a6xa0+RyROxNmWWF6LPAATD5yAAAAAAAAAAAAAAAAAAAAAAAADycI2R3ZrVHoNoycXzRejBEnhf8uXykYepWfFDzZOBaQ4zlxWnNr7UdFbIi14ST1slr3I2ypWnseTNoI9nEci2fNOX0+BvXk2Vy5osjOElzTLXo/tWWzshwsUnj2P2tOO6+1L8SGDZ57lHSUSf/VJOOjifQqra7q1ZVOM4PlKL1RmcHi52Vh6+r3SgnzXNeT4FtV0otUf4uNCT7Yycf1OUbovc3rz65LvdDpjGc41wc5yUYpatt6JHOWdKLGv4eLGL+9PX8kVOZtHKzdFkWuUU9VFLRISuithZnVxXd6kzbe13nT9DS2seL+c32+Hd/pVIBGlJyerKmyyVkuaQABqaAAAAAAAAAAAAAAAAAAA7vZl3rGzseze3m4JN9rXB/U4Q6fotlb+PZiyl7UHvRT7Hz+v4nal6S0J2BPls5X4l8ACYXQAAAAAAAAAAAAAAANGfa6cDIsT0ca5NeOnA3lN0nyVVgRoWm9dL6Lj+OhrN6RbOV0+StyOTABXnnAAAAAAAAAAdvsW/0+yqJPnGO4/lwOIOn6J264+RVp7s1LXxWn5Hal6S0JuDPS3TzL4AEwuwAAAUfS2n0mylYktarE2+58PzReEDbtXptjZUeyG9/h4/kb1vSSZmPRnz4AFmSQAAA1qtCJyJZGsWljLLh8u9KJX58eikYAAtisAAABf7Ef8At+C/7yH4ooC82JJet4UnyVsP+4839pI648X6/wDRznvF+s+jgA+VlwAAACHtF+xCPa9SYQdovjWvE3r9JHSr00QwASyaeHINOLafBrgzsDksiUZ5Fs4e7Kba8NSZibs438RlhR7i1b8/UagATjyIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALTo7a69r1pNJTUovXw1/FIqzKE5V2RnB6Si00+xm0Xo9TeuXJNS8j6GACwPSgAAAAAAAAAAAAAAA4rbWb67tCcoy1rh7MPDtLzpHtBY+M8WH8y5cfux/fkcmRbp/hRU592r7Ne8AAjlaAAAAAAAAAC76K2OOfbDXhKvXTtaa/VlITti2qna2PJ8nLd81p+ZvB6SR2oly2xfrO3ABPPRAAAAxshGyuUJrWMk013GQAPm2ZjWYeVZj2+/W9Hp19jNB0nTHGjDIx8iKetkXGXDhw00+fH6HNlnXLmimSYvVagAG5kGi9e2n2o3mrIXsp95Kw5ctyI2XHWpmgAF8UoAAALvYkd7Kwovrtiv8xSHSdFsd5Gfipa6Vv0ja6tOP46HnftJJRxE35/6ZpJauK9Z34APlJbgAAAr9ofzo/0/mywK3PknkaLqikzpV6R1p9IjgGNk41wc5yUYrm2yUTG9OrNWZf6ti2W6auK4ePUcoTtp53rdu7Bv0MeS7X2kEs8etwj13Z5rPyFdZpHZAAHcgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH0KixXUV2rlOKkvmjMo+jWerMd4lkv4lerhr1x/YvCwjLmWp6OmxWQUkAAbHUAAAAAAAAAEfPzK8HFldZx04Rjr7z6kZ5WTViUSuulpCPm+5HF7Tz7NoZLslqoLhCHwo5WWcq9ZEychUx0W5oyb7MrInda9ZzerNQBDKJtt6sAAwAAAAAAAAAAZRk4SUovSSeqa6jEAH0HHtV+PXclorIqWnZqjYUfRjMVmLLFlL263rFfdf7/iXhYRlzLU9HTZ2kFIAA2OoAABz3TKUFhY8W1vuzVLu04/ijkC+6W5au2hDHjpu0R4/1PRv6aFCWFK0giRBaRAAOxsDC5a1+BmY3fy2daHpbH2o53LWuXsIoAPRlAAAADseh2VRj3ehtSjO6MVCb7ez5/kcek20lzZbJaLRcjy32m0sqhS/HV/A5ysdclJH0wHK7K6SyqSpz9ZxSSjalrJf1dvjz4dZ0ePmY2VHXHvrs4a6KXFeK5o+bW0TqfeRZV3QsXRm8Hjaim20kutlbnbewsOMkrFdalwhXx4975I5whKb0itTpKcYLWTJWfmV4GJO+xr2V7MddN59SOV/t+UnrZjpyfGTUvy0IW0to37Sv9Jc9EuEILlFEMuKMOMI9/qytnnWKX9t6IuJ7dej3MdJ9TctfpoV2TmX5T/izbSeqiuCRoBKjVCHVI4W5V1q0nLoAAdCOf//Z';

export async function initializeTestTeachers(): Promise<void> {
	await db.addTeacher('marcos', 1);
	await db.addTeacher('burke', 1);
	await db.addTeacher('doherty', 1);
	await db.addTeacher('schillo', 1);
	await db.addTeacher('boyle', 2);
	await db.addTeacher('eklund', 2);
	await db.addTeacher('mitchinson', 2);
	await db.addTeacher('rosales-medina', 2);
	await db.addTeacher('mrs_thirdgrade', 3);
	await db.addTeacher('mr_fourthgrade', 4);
	await db.addTeacher('mrs_fourthgrade', 4);
	await db.addTeacher('mrs_fifthgrade', 5);
}

export async function resetStudentsAndScores(): Promise<void> {
	await db.prisma.score.deleteMany({});
	await db.prisma.student.deleteMany({});

	const studentGroup1 = await db.addStudents(studentGroup1Marcos, 'marcos', getCurrentYearInt());

	const studentGroup2 = await db.addStudents(studentGroup2Burke, 'burke', getCurrentYearInt());

	const studentGroup3 = await db.addStudents(studentGroup3Doherty, 'doherty', getCurrentYearInt());

	const studentGroup4 = await db.addStudents(studentGroup4Schillo, 'schillo', getCurrentYearInt());

	const studentGroup5 = await db.addStudents(studentGroup5Boyle, 'boyle', getCurrentYearInt());

	const studentGroup6 = await db.addStudents(studentGroup6Eklund, 'eklund', getCurrentYearInt());

	const studentGroup7 = await db.addStudents(
		studentGroup7Mitchinson,
		'mitchinson',
		getCurrentYearInt()
	);

	const studentGroup8 = await db.addStudents(
		studentGroup8RosalesMedina,
		'rosales-medina',
		getCurrentYearInt()
	);

	await db.addStudents(['thirdgrader1', 'thirdgrader2'], 'mrs_thirdgrade', getCurrentYearInt());

	await db.addStudents(
		['fourthgrader1', 'fourthgrader2', 'fourthgrader3', 'fourthgrader4'],
		'mr_fourthgrade',
		getCurrentYearInt()
	);

	await db.addStudents(['fifthgrader1', 'fifthgrader2'], 'mrs_fifthgrade', getCurrentYearInt());

	const groupsToSeedScoresOf = [
		{ s: studentGroup1, sG: (i) => 3.5 + i * 0.2, q: g1QuizCodes },
		{ s: studentGroup2, sG: (i) => 4.5 + i * 0.2, q: g1QuizCodes },
		{ s: studentGroup3, sG: (i) => 2.5 + i * 0.2, q: g1QuizCodes },
		{ s: studentGroup4, sG: (i) => 5.5 + i * 0.2, q: g1QuizCodes },
		{ s: studentGroup5, sG: (i) => 5.5 + i * 0.2, q: g2QuizCodes },
		{ s: studentGroup6, sG: (i) => 6.5 + i * 0.2, q: g2QuizCodes },
		{ s: studentGroup7, sG: (i) => 4.5 + i * 0.2, q: g2QuizCodes },
		{ s: studentGroup8, sG: (i) => 5.5 + i * 0.2, q: g2QuizCodes }
	];

	const scoresToCreate = [];

	groupsToSeedScoresOf.forEach((group) => {
		group.s.forEach((student) => {
			group.q.forEach((quizCode, qIndex) => {
				const createdAt = getRandomDateForQuarterAndSequence(
					parseInt(quizCode.charAt(2)), // quarter
					parseInt(quizCode.charAt(3)) // sequence
				);

				scoresToCreate.push({
					studentId: student.id,
					quizCode,
					correctAnswers: group.sG(qIndex),
					createdAt,
					timeFinished:
						student.name === 'secondgrader1'
							? new Date()
							: addSeconds(createdAt, Math.floor(Math.random() * 121) + 300),
					// note: these could be made more accurate by using the quiz data against "correctAnswers", this is fine for now
					answers: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0']
				});
			});
		});
	});

	//////////////////////////////////////////////////////////////////
	await db.prisma.score.createMany({
		data: scoresToCreate
	});
}

export async function resetDrawingsToTestData(): Promise<void> {
	const mitchinsonStudents = await db
		.getTeacher('mitchinson')
		.then((t) => db.getStudentsOfTeacher(t?.id || 0, getCurrentYearInt()));
	const eklundStudents = await db
		.getTeacher('eklund')
		.then((t) => db.getStudentsOfTeacher(t?.id || 0, getCurrentYearInt()));

	await db.prisma.drawing.deleteMany({});
	const drawingsToMake: Prisma.DrawingCreateManyInput[] = [];

	g2QuizCodes.slice(0, 8).forEach((quizCode, i) => {
		drawingsToMake.push({
			jpgBase64: sampleJpgBase64,
			studentId: mitchinsonStudents[i].id,
			accessCode: quizCode
		});
	});

	g2QuizCodes.slice(0, 4).forEach((quizCode, i) => {
		drawingsToMake.push({
			jpgBase64: sampleJpgBase64,
			studentId: eklundStudents[i].id,
			accessCode: quizCode
		});
	});

	await db.prisma.drawing.createMany({ data: drawingsToMake });
}

export async function resetQuizzesToTestData() {
	await db.prisma.quiz.deleteMany({});
	const quizzesToMake: Partial<Quiz>[] = [];
	[1, 2].forEach((grade, x) => {
		[1, 2, 3, 4].forEach((quarter, y) => {
			['A', 'B', 'C', 'D'].forEach((sequenceLetter, z) => {
				quizzesToMake.push({
					title: 'temp',
					accessCode: '0' + x + y + z,
					questionsData: '1+2|3+4|5+6|1+2|3+4|5+6|1+2|3+4|5+6|0+0',
					totalQuestions: 10,
					year: getCurrentYearInt(),
					grade,
					quarter,
					sequenceLetter
				});
			});
		});
	});
	await db.prisma.quiz.createMany({ data: quizzesToMake });

	const one = await db.addQuiz(
		{ year: getCurrentYearInt(), grade: 3, quarter: 1, sequenceLetter: 'A' },
		`1+3
4/4
9-0
5x5`
	);

	const two = await db.addQuiz(
		{ year: getCurrentYearInt(), grade: 3, quarter: 1, sequenceLetter: 'B' },
		`1+2
3+4
5+6`
	);

	// quizFor2425
	await db.addQuiz(
		{ year: 2425, grade: 1, quarter: 4, sequenceLetter: 'D' },
		`1+2
3+4
5+6`
	);

	return `Quizzes for thirdgrader1 to take: ${one.accessCode} and ${two.accessCode}`;
}

export const clearAllDbEntries = async () => {
	await db.prisma.student.deleteMany({});
	await db.prisma.teacher.deleteMany({});
	await db.prisma.quiz.deleteMany({});
	await db.prisma.score.deleteMany({});
	await db.prisma.drawing.deleteMany({});
	await clearDbScores();
};

export const clearDbScores = async () => {
	await db.prisma.score.deleteMany({});
};

export async function createScoreForQuiz(
	quizAccessCode: string,
	studentName: string,
	answers: string[],
	allQuestionsAnswered = false
) {
	const student = await db.prisma.student.findFirst({ where: { name: studentName } });
	await db.prisma.score.create({
		data: {
			answers,
			quiz: {
				connect: { accessCode: quizAccessCode }
			},
			student: { connect: { id: student.id } },
			correctAnswers: 1,
			timeFinished: allQuestionsAnswered ? new Date() : null
		}
	});
}

// NOTE: Database Gets //////////////////////////////////////////

export async function getQuizByMetadata(opts: {
	year: number;
	grade: number;
	quarter: number;
	sequenceLetter: string;
}) {
	return await db.getQuizByMetadata(opts.year, opts.grade, opts.quarter, opts.sequenceLetter);
}

export async function getScore(quizCode: string) {
	return await db.prisma.score.findFirst({
		where: { quizCode },
		include: { student: true }
	});
}

export async function getDrawing(quizCode: string, studentName: string) {
	return await db.prisma.drawing.findFirst({
		where: { accessCode: quizCode, student: { name: studentName } }
	});
}

export async function printQuizCodes() {
	const quizzes = await getQuizzes();
	quizzes.forEach((quiz) => console.log(`${getReadableTitleOfQuiz(quiz)} - ${quiz.accessCode}`));
}

export async function getQuizzes() {
	return await db.prisma.quiz.findMany({});
}

// NOTE: Common UI Ops //////////////////////////////////////////

export const loginAsAdmin = async (page: Page) => {
	await page.goto('/login');
	await page.locator(`button:has-text("Admin")`).click();
	await page.locator(`input`).fill('admin');
	await page.locator(`button:has-text("Submit")`).click();
};

export const loginAsTeacher = async (page: Page, teacherName = 'mitchinson') => {
	await page.goto('/login');
	await page.locator(`button:has-text("Teacher")`).click();
	await page.locator(`#teacherName`).fill(teacherName);
	await page.locator(`#teacherPassword`).fill('teacher');
	await page.locator(`button:has-text("Submit")`).click();
};

const loginAsStudent = async (page: Page, studentName: string, grade: string, teacher: string) => {
	await page.goto('/login');
	await page.locator(`button:has-text("Student")`).click();
	await page.locator(`div[id="grade-select-${grade}"]`).click();
	await page.selectOption('select', teacher);
	await page.locator(`#studentName`).fill(studentName);
	await page.locator(`button:has-text("Submit")`).click();
};

export const loginAsFirstAlphaFirstGrader = async (page: Page) => {
	return await loginAsStudent(page, 'aallen', '1', 'doherty');
};

export const setYearTo = async (page: Page, year: number) => {
	console.log('Selecting year:', year.toString());
	await page.locator('select#year-dropdown').selectOption(year.toString());
	await page.waitForTimeout(200);
};

export const thirdGradeQuizTakerName = 'thirdgrader1';

export const loginAsTestThirdGradeQuizTaker = async (page: Page) =>
	loginAsStudent(page, thirdGradeQuizTakerName, '3', 'mrs_thirdgrade');

export const eraseThirdGradeTestTakerScores = async () =>
	db.prisma.score.deleteMany({
		where: {
			student: {
				name: thirdGradeQuizTakerName
			}
		}
	});

export const performXDistractions = async (page: Page, count: number) => {
	for (let i = 0; i < count; i++) {
		await page.evaluate(() => {
			document.dispatchEvent(new Event('visibilitychange'));
		});
	}
};

export const amountOfStudentsForTeacherFromDB = async (teacherName: string): Promise<number> => {
	return (await db.prisma.student.findMany({ where: { teacher: { name: teacherName } } })).length;
};

export async function addFourSecondGraderStudents() {
	await db.addStudents(
		['secondgrader1', 'secondgrader2', 'secondgrader3', 'secondgrader4'],
		'mitchinson',
		getCurrentYearInt()
	);
}

// NOTE: Utils //////////////////////////////////////////

const g1QuizCodes = [
	'0000',
	'0001',
	'0002',
	'0003',
	'0010',
	'0011',
	'0012',
	'0013',
	'0020',
	'0021',
	'0022',
	'0023',
	'0030',
	'0031',
	'0032',
	'0033'
];

const g2QuizCodes = [
	'0100',
	'0101',
	'0102',
	'0103',
	'0110',
	'0111',
	'0112',
	'0113',
	'0120',
	'0121',
	'0122',
	'0123',
	'0130',
	'0131',
	'0132',
	'0133'
];

export function _50Chance(): boolean {
	return Math.random() < 0.5;
}
