import { COLORS } from '@/services/template';
import { truthsAndLiesTemplate } from '@/services/template';
import { getRandom } from '@/utils/array';

import type { BoardData } from './interface';

type SuggestionBoard = { teamId: string; ownerId: string; }
type StandardBard = SuggestionBoard & { members: string[]; }

export const standardReactions = ['👍', '👎', '👏', '❤️', '😂', '🤔', '🔥', '🎉', '😱'];

export function truthsAndLies({
    teamId,
    members,
    ownerId,
}: StandardBard): Omit<BoardData, 'id' | 'createdAt' | 'status'> {
    const reactions = ['🍕', '🍔', '🍟', '🌭', '🍿', '🥝', '🥥', '🍇', '🍎', '🍍', '🍉', '🍄', '🌷', '🌼', '🌵', '🍀'];

    const selectedReactions: string[] = [];

    const text = members.map(member => {
        const reaction = getRandom(reactions);

        selectedReactions.push(reaction);

        reactions.splice(reactions.indexOf(reaction), 1);

        return `${reaction}: ${member}`;
    }).join('\n');

    return {
        name: 'Verdades e Mentiras',
        description: 'Jogo de Verdades e Mentiras',
        teamId,
        ownerId,
        cards: {
            fatos: [],
            verdades: [],
            mentiras: [],
            legenda: [
                {
                    text,
                    id: 'legenda',
                    column: 'legenda',
                    whoLiked: [],
                    color: COLORS[4],
                    owner: { id: 'sprint-review', name: 'Sprint Review', },
                    reactions: {},
                }
            ]
        },
        reactions: selectedReactions,
        template: truthsAndLiesTemplate(teamId)
    };
}